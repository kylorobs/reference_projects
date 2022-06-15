import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';
import { getPosts } from '../../lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) return res.status(401);

    if (req.method === 'GET') {
        const posts = await getPosts(prisma);
        res.status(200).json({ data: posts });
    }
}
