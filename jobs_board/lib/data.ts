import type { Job, PrismaClient, User, Application } from '@prisma/client';

export type JobWithAuthor = Job & { author: User };
export type JobWithApplications = JobWithAuthor & { applications: ApplicationExtended[] };
export type ApplicationExtended = Application & { author: User; job: Job };

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

export const getJobApplications = async (jobId: string, prisma: PrismaClient): Promise<ApplicationExtended[]> => {
    const applications = await prisma.application.findMany({
        where: { jobId: +jobId },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
            job: true,
        },
    });

    return applications;
};

export const getAllJobsPosted = async (userId: string, prisma: PrismaClient): Promise<JobWithApplications[]> => {
    const jobs = (await prisma.job.findMany({
        where: { authorId: userId },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
        },
    })) as JobWithApplications[];

    await Promise.all(jobs.map(async (job) => (job.applications = await getJobApplications(`${job.id}`, prisma))));

    return jobs;
};

export const getUserApplications = async (userId: string, prisma: PrismaClient): Promise<ApplicationExtended[]> => {
    const applications = await prisma.application.findMany({
        where: {
            authorId: userId,
        },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
            job: true,
        },
    });

    return applications;
};

export const alreadyApplied = async (userId: string, jobId: string, prisma: PrismaClient): Promise<boolean> => {
    const applications = await prisma.application.findMany({
        where: {
            authorId: userId,
            jobId: +jobId,
        },
    });

    return applications.length > 0;
};
