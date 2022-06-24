import type { PrismaClient, User, Post, Subreddit, Vote, Comment } from '@prisma/client';

export type PostWithAuthor = Post & { author: User };
export type CommentWithUser = Comment & { user: User };
export type CommentExtended = Comment & {
    author: User;
};
export type PostWithAuthorAndComments = Post & { author: User } & { comments: CommentExtended[] };

export type CommentWithComments = CommentExtended & { comments: CommentWithComments[] };

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

async function fetchCommentsOfComments(
    comments: CommentExtended[],
    prisma: PrismaClient
): Promise<CommentWithComments[]> {
    return Promise.all(
        comments.map(async (comment) => {
            const extended = comment as CommentWithComments;
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            extended.comments = await getComments(comment.id, prisma);
            return extended;
        })
    );
}

async function getComments(parentId: number, prisma: PrismaClient): Promise<CommentWithComments[]> {
    const comments = await prisma.comment.findMany({
        where: {
            parentId,
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

    const commentsWithComments = comments as CommentWithComments[];

    if (comments.length) return fetchCommentsOfComments(comments, prisma);

    return commentsWithComments;
}

// async function getComments(parentId: number, prisma: PrismaClient): Promise<CommentWithComments[]> {
//     const comments = await prisma.comment.findMany({
//         where: {
//             parentId,
//         },
//         orderBy: [
//             {
//                 id: 'desc',
//             },
//         ],
//         include: {
//             author: true,
//         },
//     });

//     let extended = comments as unknown as CommentWithComments[];

//     if (comments.length) {
//         // eslint-disable-next-line @typescript-eslint/no-use-before-define
//         extended = await fetchCommentsOfComments(comments, prisma);
//     }

//     return extended;
// }

export const getPost = async (id: number, prisma: PrismaClient): Promise<PostWithAuthorAndComments | null> => {
    const post = (await prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
            comments: {
                where: {
                    parentId: null,
                },
                orderBy: [{ id: 'desc' }],
            },
        },
    })) as PostWithAuthorAndComments | null;

    if (post?.comments) {
        post.comments = await fetchCommentsOfComments(post.comments, prisma);
    }

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

export const getVotes = async (post: number, prisma: PrismaClient) => {
    const upvotes = await prisma.vote.count({
        where: {
            postId: post,
            up: true,
        },
    });
    const downvotes = await prisma.vote.count({
        where: {
            postId: post,
            up: false,
        },
    });

    return upvotes - downvotes;
};

export const getVote = async (postId: number, userId: string, prisma: PrismaClient): Promise<Vote | null> => {
    const vote = await prisma.vote.findMany({
        where: {
            postId,
            authorId: userId,
        },
    });

    if (vote.length === 0) return null;
    return vote[0];
};
