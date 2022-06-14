import type { PrismaClient, User, Post } from '@prisma/client';

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
