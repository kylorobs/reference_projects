import type { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';
import type { User, Subreddit, Post } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.end();

    const { task } = req.body as { task: string };

    if (task === 'generate_users') {
        for (let i = 0; i < 10; i++) {
            prisma.user.create({
                data: {
                    name: faker.internet.userName().toLowerCase(),
                    email: faker.internet.email(),
                    image: faker.internet.avatar(),
                },
            });
        }
    }

    if (task === 'generate_subreddits') {
        for (let i = 0; i < 10; i++) {
            prisma.subreddit.create({
                data: {
                    name: faker.word.noun().toLowerCase(),
                    description: faker.lorem.paragraph(1).toLowerCase(),
                },
            });
        }
    }

    if (task === 'add_fake_content') {
        const users = await prisma.user.findMany();
        const subreddits = await prisma.subreddit.findMany();

        const getRandomUser = (usersAr: User[]): User => {
            return usersAr[Math.floor(Math.random() * usersAr.length)];
        };

        const createPostFromRandomUser = async (subreddit: Subreddit): Promise<Post> => {
            const user = getRandomUser(users);
            const post = await prisma.post.create({
                data: {
                    title: `${faker.hacker.adjective()} ${faker.hacker.verb()} ${faker.hacker.phrase()}`,
                    content: faker.hacker.phrase(),
                    subreddit: {
                        connect: {
                            name: subreddit.name,
                        },
                    },
                    author: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
            return post;
        };

        const createCommentsToPost = async (post: Post) => {
            let count = 0;
            const commentsNumber = Math.floor(Math.random() * 5);

            while (count < commentsNumber) {
                const user = getRandomUser(users);

                await prisma.comment.create({
                    data: {
                        content: faker.hacker.phrase(),
                        post: {
                            connect: { id: post.id },
                        },
                        author: {
                            connect: { id: user.id },
                        },
                    },
                });
                count++;
            }
        };

        subreddits.forEach(async (subr) => {
            const post = await createPostFromRandomUser(subr);
            createCommentsToPost(post);
        });
    }

    if (task === 'clean_database') {
        await prisma.user.deleteMany({});
        await prisma.post.deleteMany({});
        await prisma.comment.deleteMany({});
        await prisma.subreddit.deleteMany({});
    }

    res.end();
}
