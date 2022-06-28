import type { PrismaClient, User } from '@prisma/client';

export const getUser = async (id: string, prisma: PrismaClient): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

export const getVideos = async (options: any, prisma: PrismaClient) => {
    return prisma.video.findMany({
        where: {},
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
        include: {
            author: true,
        },
    });
};
