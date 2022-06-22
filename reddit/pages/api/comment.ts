import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
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

    if (req.method === 'GET') {
        const { postId } = req.query;
        const comments = await prisma.comment.findMany({
            where: {
                postId: +postId,
            },
            orderBy: [
                {
                    id: 'desc',
                },
            ],
        });
        res.json({ data: comments });
    }

    if (req.method === 'POST') {
        const { content, post } = req.body as { content: string; post: number };
        const comment = await prisma.comment.create({
            data: {
                content,
                post: {
                    connect: {
                        id: post,
                    },
                },
                author: {
                    connect: { id: user.id },
                },
            },
        });

        res.json(comment);
    }
}
