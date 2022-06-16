import type { PrismaClient, User, Post, Subreddit } from '@prisma/client';

export type PostWithAuthor = Post & { author: User };

export const getUser = async (id: string, prisma: PrismaClient): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

export const getPosts = async (prisma: PrismaClient): Promise<PostWithAuthor[]> => {
    return prisma.post.findMany({
        where: {},
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
        },
    });
};

export const getPost = async (id: number, prisma: PrismaClient): Promise<PostWithAuthor | null> => {
    const post = (await prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
        },
    })) as PostWithAuthor | null;
    return post;
};

export const getSubreddit = async (name: string, prisma: PrismaClient): Promise<Subreddit | null> => {
    return prisma.subreddit.findUnique({
        where: {
            name,
        },
    });
};

export const getPostsFromSubreddit = async (subreddit: string, prisma: PrismaClient): Promise<PostWithAuthor[]> => {
    const posts = await prisma.post.findMany({
        where: {
            subreddit: {
                name: subreddit,
            },
        },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
        },
    });

    return posts;
};
