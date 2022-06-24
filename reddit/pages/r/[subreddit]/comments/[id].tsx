import { GetServerSideProps } from 'next';
import type { Subreddit as SubredditT, Vote } from '@prisma/client';
import moment from 'moment';
import Link from 'next/link.js';
import { useSession, getSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { getPost, getSubreddit, getVote, getVotes, PostWithAuthorAndComments } from '../../../../lib/data';
import { prisma } from '../../../../lib/prisma';
import NewComment from '../../../../components/NewComment';
import Comments from '../../../../components/Comments';
import { fetchPostWithComments } from '../../../../lib/queries';

export default function Post({
    subreddit,
    post,
    vote,
    votes,
}: {
    subreddit: SubredditT;
    post: PostWithAuthorAndComments;
    vote: Vote | null;
    votes: number;
}) {
    const {
        isFetching,
        error,
        data: postData,
    } = useQuery(['comments', { postId: 4 }], () => fetchPostWithComments({ postId: post.id }), {
        initialData: post,
    });
    const { data: session, status } = useSession();

    const router = useRouter();

    const sendVote = async (up: boolean) => {
        await fetch('/api/vote', {
            body: JSON.stringify({
                post: postData?.id,
                up,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        router.reload();
    };

    if (!post) return <p className="text-center p-5">Post does not exist 😞</p>;

    const loading = status === 'loading';

    if (loading) {
        return null;
    }

    if (!postData || error) return <p> We have an error</p>;
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

            <div className="flex flex-row mb-4  px-5 justify-center">
                <div className="flex flex-col mb-4 border-t border-l border-b border-3 border-black p-10 bg-gray-200 my-10 text-center">
                    <div
                        className="cursor-pointer"
                        onClick={async (e) => {
                            e.preventDefault();
                            sendVote(true);
                        }}
                        onKeyDown={(e) => {
                            e.preventDefault();
                            sendVote(true);
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        {vote?.up ? '⬆' : '↑'}
                    </div>
                    <div>0</div>
                    <div
                        className="cursor-pointer"
                        onClick={async (e) => {
                            e.preventDefault();
                            sendVote(false);
                        }}
                        onKeyDown={(e) => {
                            e.preventDefault();
                            sendVote(false);
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        {!vote ? '↓' : vote?.up ? '↓' : '⬇'}
                    </div>
                </div>

                <div className="flex flex-col mb-4 border-t border-r border-b border-3 border-black p-10 pl-0 bg-gray-200 my-10">
                    <div className="flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 mx-20 my-10">
                        <div className="flex flex-shrink-0 pb-0 ">
                            <div className="flex-shrink-0 block group ">
                                <div className="flex items-center text-gray-800">
                                    Posted by {postData?.author.name}{' '}
                                    <p className="mx-2 underline">{moment(new Date(postData.createdAt)).fromNow()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1">
                            <a className="flex-shrink text-2xl font-bold color-primary width-auto">{postData.title}</a>
                            <p className="flex-shrink text-base font-normal color-primary width-auto mt-2">
                                {post.content}
                            </p>
                        </div>
                    </div>
                    {session ? (
                        <NewComment post={postData} />
                    ) : (
                        <p className="mt-5">
                            <Link href="/api/auth/signin">Login</Link>
                            to add a comment
                        </p>
                    )}
                    {postData.comments && <Comments comments={postData.comments} post={post} />}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    const params = context.params as unknown as { subreddit: string; id: string };
    const subreddit = (await getSubreddit(params.subreddit, prisma)) as SubredditT;
    let post = await getPost(parseInt(params.id), prisma);
    post = JSON.parse(JSON.stringify(post)) as PostWithAuthorAndComments;

    let votes = await getVotes(parseInt(params.id), prisma);
    votes = JSON.parse(JSON.stringify(votes)) as number;

    let vote = await getVote(parseInt(params.id), session?.user.id || '', prisma);
    vote = JSON.parse(JSON.stringify(vote)) as Vote | null;

    return {
        props: {
            subreddit,
            post,
            vote,
            votes,
        },
    };
};
