import type { PrismaClient, User, Prisma, Video, User } from '@prisma/client';

export const getUser = async (id: string, prisma: PrismaClient): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

export const getVideos = async (
    options: { take?: number; userId?: number | string },
    prisma: PrismaClient
): Promise<(Video & { author: User })[]> => {
    const data = {
        where: {},
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
        include: {
            author: true,
        },
    } as Partial<Prisma.VideoFindManyArgs>;

    if (options.take) data.take = options.take;
    if (options.userId) data.where = { id: `${options.userId}` };
    const res = (await prisma.video.findMany(data)) as (Video & { author: User })[];
    return res;

    // THIS WITH INFERRED TYPES

    // return prisma.video.findMany({
    //     where: {},
    //     orderBy: [
    //         {
    //             createdAt: 'desc',
    //         },
    //     ],
    //     include: {
    //         author: true,
    //     },
    // });
};

export const getVideo = async (id: string, prisma: PrismaClient) => {
    const video = await prisma.video.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
        },
    });

    return video;
};
