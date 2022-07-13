import type { NextApiRequest, NextApiResponse } from 'next';
import { paginationAmount } from '../../lib/config';
import { getVideos } from '../../lib/data';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(501).end();
    }

    if (req.method === 'GET') {
        const { take, skip } = req.query as { take?: string; skip?: string };
        const qtake = parseInt(take || `${paginationAmount}`);
        const qskip = parseInt(skip || '0');

        const videos = await getVideos({ take: qtake, skip: qskip }, prisma);
        res.json(videos);
    }
}
