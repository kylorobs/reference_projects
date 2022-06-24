import type { Comment } from '@prisma/client';
import { CommentExtended, PostWithAuthor, PostWithAuthorAndComments } from './data';

export async function fetchPosts(): Promise<PostWithAuthor[]> {
    const res = (await (await fetch('/api/posts')).json()) as { data?: PostWithAuthor[]; error?: boolean };
    if (!res.data || res.error) throw new Error('No data!');
    return res.data;
}

export async function fetchPostWithComments({ postId }: { postId: number }): Promise<PostWithAuthorAndComments> {
    const res = (await (await fetch(`/api/comment?postId=${postId}`)).json()) as {
        data?: PostWithAuthorAndComments;
        error?: boolean;
    };
    if (!res.data || res.error) throw new Error('No data!');
    return res.data;
}

export async function setUserName(name: string): Promise<> {
    const res = await fetch('/api/setup', {
        body: JSON.stringify({
            name,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    return res;
}

type Params = {
    postId: number;
    parentId: number;
    content: string;
};

export async function createComment({ postId, content, parentId }: Params): Promise<Comment> {
    const res = await fetch('/api/comment', {
        body: JSON.stringify({
            content,
            parentId,
            postId,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    const result = (await res.json()) as Comment;
    return result;
}
