import { GetServerSideProps } from 'next';
import type { Subreddit as SubredditT } from '@prisma/client';
import moment from 'moment';
import Link from 'next/link.js';
import { useSession } from 'next-auth/react';
import { getPost, getSubreddit } from '../../../../lib/data';
import { prisma } from '../../../../lib/prisma';
import type { PostWithAuthor } from '../../../../lib/data';
import NewComment from '../../../../components/NewComment';

export default function Post({ subreddit, post }: { subreddit: SubredditT; post: PostWithAuthor }) {
    if (!post) return <p className="text-center p-5">Post does not exist 😞</p>;
    const { data: session, status } = useSession();

    const loading = status === 'loading';

    if (loading) {
        return null;
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
                <Link href={`/r/${subreddit.name}`}>
                    <a className="text-center underline">/r/{subreddit.name}</a>
                </Link>
                <p className="ml-4 text-left grow">{subreddit.description}</p>
            </header>

            <div className="flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 mx-20 my-10">
                <div className="flex flex-shrink-0 pb-0 ">
                    <div className="flex-shrink-0 block group ">
                        <div className="flex items-center text-gray-800">
                            Posted by {post.author.name}{' '}
                            <p className="mx-2 underline">{moment(new Date(post.createdAt)).fromNow()}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-1">
                    <a className="flex-shrink text-2xl font-bold color-primary width-auto">{post.title}</a>
                    <p className="flex-shrink text-base font-normal color-primary width-auto mt-2">{post.content}</p>
                </div>
            </div>
            {session ? (
                <NewComment post={post} />
            ) : (
                <p className="mt-5">
                    <Link href="/api/auth/signin">Login</Link>
                    to add a comment
                </p>
            )}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const params = context.params as unknown as { subreddit: string; id: string };
    const subreddit = (await getSubreddit(params.subreddit, prisma)) as SubredditT;
    let post = await getPost(parseInt(params.id), prisma);
    post = JSON.parse(JSON.stringify(post)) as PostWithAuthor;

    return {
        props: {
            subreddit,
            post,
        },
    };
};
