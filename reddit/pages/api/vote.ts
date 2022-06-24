import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
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

    if (req.method === 'POST') {
        const { post, up } = req.body as { post: number; up: boolean };
        // we use the upsert() method provided by Prisma to update or insert a value if it’s not there.
        await prisma.vote.upsert({
            where: {
                authorId_postId: {
                    authorId: user.id,
                    postId: post,
                },
            },
            update: {
                up,
            },
            create: {
                up,
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

        res.end();
    }
}
