import type { Job, PrismaClient, User } from '@prisma/client';

export type JobWithAuthor = Job & { author: User };

export const getJobs = (prisma: PrismaClient): Promise<JobWithAuthor[]> => {
    return prisma.job.findMany({
        where: {
            published: true,
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
};

export const getJob = async (id: string, prisma: PrismaClient): Promise<JobWithAuthor | null> => {
    return prisma.job.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            author: true,
        },
    });
};

export const getCompany = async (id: string, prisma: PrismaClient): Promise<User | null> => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

export const getCompanyJobs = async (id: string, prisma: PrismaClient): Promise<JobWithAuthor[]> => {
    const jobs = await prisma.job.findMany({
        where: { authorId: id, published: true },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
        },
    });

    return jobs;
};

export const getAllJobsPosted = async (userId: string, prisma: PrismaClient): Promise<JobWithAuthor[]> => {
    const jobs = await prisma.job.findMany({
        where: { authorId: userId },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
        },
    });

    return jobs;
};
