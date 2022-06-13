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

    const { coverletter, job } = req.body as { coverletter: string; job: string };

    if (!coverletter) return res.status(400).json({ message: 'Required parameter coverletter missing' });
    if (!job) return res.status(400).json({ message: 'Required parameter job missing' });

    await prisma.application.create({
        data: {
            coverletter,
            job: {
                connect: { id: +job },
            },
            author: {
                connect: { id: session.user.id },
            },
        },
    });

    res.status(200).end();
}
