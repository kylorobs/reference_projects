import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(501).end();
    }
    const { channelId } = req.query as { channelId?: string };
    if (!channelId) return res.status(401).end();

    const session = await getSession({ req });

    if (!session) return res.status(401).json({ message: 'Not logged in' });
    console.log('UPLOADING');
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    const userToSubscribeTo = await prisma.user.findUnique({
        where: {
            id: channelId,
        },
    });

    if (!userToSubscribeTo) {
        return res.status(401).json({ message: 'User not found' });
    }

    await prisma.user.update({
        where: {
            id: channelId,
        },
        data: {
            subscribedTo: {
                connect: [{ id: channelId }],
            },
        },
    });

    res.end();
}
