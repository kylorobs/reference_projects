import type { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const generateFakeJob = (user: User) => ({
    title: faker.company.catchPhrase(),
    description: faker.lorem.paragraphs(),
    author: {
        connect: { id: user.id },
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.end();

    const body = req.body as { task: 'clean_database' | 'generate_one_job' | 'generate_users_and_jobs' };

    if (body.task === 'clean_database') {
        await prisma.job.deleteMany({});
        await prisma.user.deleteMany({});
    } else if (body.task === 'generate_one_job') {
        const users = await prisma.user.findMany({
            where: {
                company: true,
            },
        });

        await prisma.job.create({
            data: generateFakeJob(users[0]),
        });
    } else if (body.task === 'generate_users_and_jobs') {
        let count = 0;

        while (count < 10) {
            await prisma.user.create({
                data: {
                    name: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email().toLowerCase(),
                    company: faker.datatype.boolean(),
                },
            });
            count++;
        }

        const users = await prisma.user.findMany({
            where: {
                company: true,
            },
        });

        users.forEach(async (user) => {
            await prisma.job.create({
                data: generateFakeJob(user),
            });
        });
    }

    res.end();
}
