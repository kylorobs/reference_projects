import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getPost } from '../../lib/data';
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
        const comments = await getPost(+postId, prisma);
        res.json({ data: comments });
    }

    if (req.method === 'POST') {
        const { content, postId, parentId } = req.body as { content: string; postId: number; parentId: string };

        const data = {
            content,
            post: {
                connect: {
                    id: +postId,
                },
            },
            author: {
                connect: { id: user.id },
            },
            parent: {},
        };
        if (parentId) {
            data.parent = {
                connect: {
                    id: parentId,
                },
            };
        }

        const comment = await prisma.comment.create({ data });

        res.json(comment);
    }
}
