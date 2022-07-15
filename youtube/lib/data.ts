import type { PrismaClient, User, Prisma, Video } from '@prisma/client';
import { paginationAmount } from './config';

export type Channel = User & { subscribers: User[]; username: string };
export type VideoWithLikes = Video & { likes: User[] };

export const getUser = async (id: string, prisma: PrismaClient): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            subscribers: true,
        },
    });
};

export const getVideos = async (
    options: { take?: number; userId?: string; skip?: number },
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

    console.log(options);

    data.take = options.take || paginationAmount;
    if (options.skip) data.skip = options.skip;
    if (options.userId) data.where = { authorId: options.userId };
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

export const getVideoLikes = async (id: string, prisma: PrismaClient) => {
    const video = (await prisma.video.findUnique({
        where: {
            id,
        },
        include: {
            likes: true,
        },
    })) as VideoWithLikes;

    return video?.likes.length || 0;
};

export const checkIfVideoIsLiked = async (videoId: string, id: string | undefined, prisma: PrismaClient) => {
    if (!id) return false;
    const video = (await prisma.video.findUnique({
        where: {
            id: videoId,
        },
        include: {
            likes: true,
        },
    })) as VideoWithLikes;

    return !!video?.likes.find((user) => user.id === id);
};

export const getSubscribersCount = async (id: string, prisma: PrismaClient) => {
    const user = (await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            subscribers: true,
        },
    })) as Channel;

    return user.subscribers.length;
};
