import type { Comment } from '@prisma/client';
import { PostWithAuthor } from './data';

export async function fetchPosts(): Promise<PostWithAuthor[]> {
    const res = (await (await fetch('/api/posts')).json()) as { data?: PostWithAuthor[]; error?: boolean };
    if (!res.data || res.error) throw new Error('No data!');
    return res.data;
}

export async function fetchPostComments(): Promise<Comment[]> {
    const res = (await (await fetch('/api/comment')).json()) as { data?: Comment[]; error?: boolean };
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
    id: number;
    content: string;
};

export async function createComment({ id, content }: Params): Promise<Comment> {
    const res = await fetch('/api/comment', {
        body: JSON.stringify({
            post: id,
            content,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    const result = (await res.json()) as Comment;
    return result;
}
