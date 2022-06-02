import { getSession } from 'next-auth/react';
import { deleteTweet } from '../../lib/data';
import prisma from '../../lib/prisma';

export async function handler(req, res) {
  const session = await getSession();
  if (!session.user || req.body.id !== session.userId) return res.status(401).end();

  if (req.method === 'DELETE') {
    await deleteTweet(req.body.id, prisma);
    res.status(200).end();
  }
}
