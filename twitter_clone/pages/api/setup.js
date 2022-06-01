import { getSession } from 'next-auth/react';
import { getUserNames } from '../../lib/data';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.end();

  if (req.method === 'POST') {
    const suppliedName = req.body.name;
    // CHECK IF USERNAME EXISTS
    const names = await getUserNames(prisma);
    if (names.find((user) => user.name === suppliedName))
      return res.status(403).json({ message: 'Username already taken' });

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: req.body.name,
      },
    });
    res.status(202).json({ success: true });
  }
}
