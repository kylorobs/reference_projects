import { faker } from '@faker-js/faker';
import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (req.method !== 'POST') return res.end();

  if (req.body.task === 'clean_database') {
    await prisma.tweet.deleteMany({}); // deletes all tweets
    await prisma.user.deleteMany({
      // deletes all users except the current logged in user
      where: {
        NOT: {
          id: {
            in: [session.user.id],
          },
        },
      },
    });
  }

  if (req.body.task === 'generate_users_and_tweets') {
    // FIRST STEP, CREATE 5 USERS
    let count = 0;

    while (count < 5) {
      await prisma.user.create({
        data: {
          name: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          image: faker.internet.avatar(),
        },
      });
      count++;
    }

    // CREATE 1 TWEET FOR EACH USER
    const users = await prisma.user.findMany({});

    users.forEach(async (user) => {
      await prisma.tweet.create({
        data: {
          content: faker.hacker.phrase(),
          author: {
            connect: { id: user.id },
          },
        },
      });
    });
  }

  if (req.body.task === 'generate_one_tweet') {
    const users = await prisma.user.findMany({});

    const randomIndex = Math.floor(Math.random() * users.length);
    const user = users[randomIndex]; // Get random user

    await prisma.tweet.create({
      data: {
        content: faker.hacker.phrase(), // faker gets a phrase
        author: {
          connect: { id: user.id }, // random user as author
        },
      },
    });
  }

  res.end();
}
