import { PostWithAuthor } from './data';

export async function fetchPosts(): Promise<PostWithAuthor[]> {
    console.log('FETCHING');
    const res = (await (await fetch('/api/posts')).json()) as { data?: PostWithAuthor[]; error?: boolean };
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
    if (!res.data || res.error) throw new Error('No data!');
    return res.data;
}