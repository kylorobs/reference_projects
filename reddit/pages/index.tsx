import { NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Posts from '../components/Posts';
import { getPosts, PostWithAuthor } from '../lib/data';
import { prisma } from '../lib/prisma';

export default function Home({ posts }: PostWithAuthor[]) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return null;
    }

    if (session) {
        router.push('/home');
    }
    return (
        <>
            <div>
                <Head>
                    <title>Reddit</title>
                    <meta name="description" content="A clone of the Reddit App" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Posts posts={posts} />
            </div>
            <Link href="/api/auth/signin">
                <a>login</a>
            </Link>
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
