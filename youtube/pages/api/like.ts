import type { NextApiRequest, NextApiResponse } from 'next';
import type { User, Video } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export type VideoWithLikes = Video & { likes: User[] };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(501).end();
    }
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: 'Not logged in' });

    const { id } = req.query as { id?: string };

    const video = (await prisma.video.findUnique({
        where: {
            id,
        },
        include: {
            likes: true,
        },
    })) as VideoWithLikes;
    const userAlreadyLikes = video?.likes.find((user) => user.id === session.user.id);
    if (userAlreadyLikes) res.end();

    await prisma.video.update({
        where: {
            id,
        },
        data: {
            likes: {
                connect: [{ id: session.user.id }],
            },
        },
    });

    res.end();
}
