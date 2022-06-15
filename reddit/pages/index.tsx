import { NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Posts from '../components/Posts';
import { getPosts, PostWithAuthor } from '../lib/data';
import { prisma } from '../lib/prisma';
import { fetchPosts } from '../lib/queries';

export default function Home({ posts }: { posts: PostWithAuthor[] }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { isFetching, error, data } = useQuery<PostWithAuthor[], { error: boolean }>('posts', fetchPosts, {
        initialData: posts,
    });

    if (status === 'loading' || !data) {
        return null;
    }

    if (error) console.log(error);

    if (!session || !session.user.name) router.push('/setup');
    return (
        <>
            <Head>
                <title>Reddit</title>
                <meta name="description" content="A clone of the Reddit App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="bg-black text-white h-12 flex pt-3 px-5 pb-2">
                <p>Reddit clone</p>
                <p className="grow" />
                <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
                    <a className="flex-l border px-4 font-bold rounded-full mb-1">{session ? 'logout' : 'login'}</a>
                </Link>
            </header>
            <Posts posts={data} />
        </>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    let posts = await getPosts(prisma);
    posts = JSON.parse(JSON.stringify(posts)) as PostWithAuthor[];
    return {
        props: {
            posts,
        },
    };
}
