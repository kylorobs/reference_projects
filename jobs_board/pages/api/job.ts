import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(501).end();
    }

    const session = await getSession({ req });

    if (!session) return res.status(401).json({ message: 'Not logged in' });

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

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
