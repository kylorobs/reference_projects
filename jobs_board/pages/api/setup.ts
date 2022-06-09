import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) return res.end();
    const body = req.body as { name: string; company: string };

    if (req.method === 'POST') {
        await prisma.user.update({
            where: { email: session.user.email! },
            data: {
                name: body.name,
                company: !!body.company,
            },
        });

        res.end();
    }
}
