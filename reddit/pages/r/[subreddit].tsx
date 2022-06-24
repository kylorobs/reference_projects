import { GetServerSideProps } from 'next';
import type { Subreddit as SubredditT } from '@prisma/client';
import Link from 'next/link.js';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getSubreddit, getPostsFromSubreddit, PostWithAuthor } from '../../lib/data';
import { prisma } from '../../lib/prisma';
import Posts from '../../components/Posts';

export default function Subreddit({ subreddit, posts }: { subreddit: SubredditT; posts: PostWithAuthor[] }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    if (!subreddit) {
        return <p className="text-center p-5">Subreddit does not exist 😞</p>;
    }

    return (
        <>
            <header className="bg-black text-white h-12 flex pt-3 px-5 pb-2">
                <Link href="/">
                    <a className="underline">Home</a>
                </Link>
                <p className="grow" />
            </header>
            <header className="bg-black text-white h-12 flex pt-3 px-5 pb-2">
                <p className="text-center">/r/{subreddit.name}</p>
                <p className="ml-4 text-left grow">{subreddit.description}</p>
            </header>
            {session && (
                <div className="border border-3 border-black p-10  mx-20 my-10">
                    <input
                        placeholder="Create post"
                        className="border-gray-800 border-2 p-4 w-full"
                        onClick={() => {
                            router.push(`/r/${subreddit.name}/submit`);
                        }}
                    />
                </div>
            )}
            <p className="text-center p-5">/r/{subreddit.name}</p>
            <Posts posts={posts} />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const params = context.params as { subreddit: string };
    const subreddit = (await getSubreddit(params.subreddit, prisma)) as SubredditT;
    let posts = await getPostsFromSubreddit(params.subreddit, prisma);
    posts = JSON.parse(JSON.stringify(posts)) as PostWithAuthor[];

    return {
        props: {
            subreddit,
            posts,
        },
    };
};
