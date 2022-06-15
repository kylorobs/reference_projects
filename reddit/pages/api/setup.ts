import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) return res.end();

    if (req.method === 'POST') {
        const { name } = req.body as { name: string };
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
            },
        });

        res.end();
    }
}
