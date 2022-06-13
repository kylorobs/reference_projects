import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { JobWithAuthor } from '../../lib/data';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // NOT CORRECT METHOD
    if (req.method !== 'POST' && req.method !== 'PUT') {
        return res.status(501).end();
    }

    // NOT SIGNED IN
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: 'Not logged in' });

    // NO USER FOUND
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });
    if (!user) return res.status(401).json({ message: 'User not found' });

    // UPDATING A JOB NOT UNDER USER
    if (req.method === 'PUT') {
        const body = req.body as { id: string; task: 'publish' | 'unpublish' };
        const job = (await prisma.job.findUnique({
            where: {
                id: parseInt(body.id),
            },
        })) as JobWithAuthor;

        if (job.authorId !== user.id) {
            res.status(401).json({ message: 'Not authorized to edit' });
        }

        if (body.task === 'publish') {
            await prisma.job.update({
                where: {
                    id: +body.id,
                },
                data: {
                    published: true,
                },
            });
        }

        if (body.task === 'unpublish') {
            await prisma.job.update({
                where: {
                    id: +body.id,
                },
                data: {
                    published: false,
                },
            });
        }

        res.status(200).end();
        return;
    }

    const { title, description, location, salary } = req.body as {
        title: string;
        description: string;
        location: string;
        salary: string;
    };

    if (!title || !description || !location || !salary)
        return res.status(400).json({ message: 'Required parameter missing' });

    await prisma.job.create({
        data: {
            title,
            description,
            location,
            salary,
            author: {
                connect: { id: user.id },
            },
        },
    });
    res.status(200).end();
}
