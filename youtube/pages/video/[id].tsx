import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { checkIfVideoIsLiked, getSubscribersCount, getVideo, getVideoLikes, getVideos } from '../../lib/data';
import { prisma } from '../../lib/prisma';
import type { VideoT, VideoArr } from '../../types';
import Video from '../../components/Video';
import NavBar from '../../components/NavBar';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function SingleVideo({
    video,
    videos,
    subscribers,
    videoAuthorId,
    userHasLiked,
    likes,
}: {
    video: VideoT;
    videos: VideoArr;
    subscribers: number;
    videoAuthorId: string | number;
    userHasLiked: boolean;
    likes: number;
}) {
    const router = useRouter();

    const likeVideo = async () => {
        const res = await fetch(`/api/like?id=${video.id}`, { method: 'POST' });
        if (res.ok) router.reload();
    };

    if (!video) return <p className="text-center p-5">Video does not exist 😞</p>;

    return (
        <>
            <Head>
                <title>YouTube Clone</title>
                <meta name="description" content="A great YouTube Clone" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar />
            <div className=" bg-gray-900 h-full my-0 p-4">
                <div className="flex p-2">
                    <div className="pr-4">
                        <div className="w-20">
                            <Link href={`/channel/${videoAuthorId}`}>
                                <img className="rounded-full" alt="logo" src={video.author.image} />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg text-gray-400">{video.author.name}</p>
                        <p className="text-lg text-gray-400">
                            <div>{subscribers} subscribers</div>
                        </p>
                    </div>
                </div>
            </div>
            <div className="h-screen flex dark:bg-slate-800 h-full">
                <div className="flex w-full flex-col mb-4 border-t border-r border-b border-3 border-black pl-0 bg-gray-900">
                    <div className="relative pt-[60%]">
                        <ReactPlayer
                            className="react-player absolute top-0 left-0"
                            url={video.url}
                            width="100%"
                            height="100%"
                            controls
                            light={video.thumbnail}
                        />
                    </div>

                    <div className="px-5 mt-5">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-2xl font-bold text-white">{video.title}</p>

                                <div className="text-gray-400">{video.views} views · </div>
                            </div>
                            <div className="flex content-center">
                                <div
                                    onClick={likeVideo}
                                    onKeyDown={likeVideo}
                                    role="button"
                                    tabIndex={0}
                                    className="text-red-400 mr-2"
                                >
                                    <svg
                                        className={`w-8 h-8 ${userHasLiked ? 'fill-red-400' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                        />
                                    </svg>
                                </div>
                                <div className=" text-red-400 p-1 dark:bg-slate-800 border-red-400 border-2 inline-block h-fit">
                                    {likes} Likes{' '}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block md:w-1/3">
                    <div className="flex flex-wrap">
                        {videos.map((vid, index) => (
                            <div className="w-full" key={index}>
                                <Video video={vid} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.params as { id: string };
    let video = await getVideo(id, prisma);
    video = JSON.parse(JSON.stringify(video)) as VideoT;

    let videos = await getVideos({ take: 3 }, prisma);
    videos = JSON.parse(JSON.stringify(videos)) as VideoArr;

    const subscriberCount = await getSubscribersCount(video.authorId, prisma);
    const videoLikes = await getVideoLikes(id, prisma);
    const userHasLiked = await checkIfVideoIsLiked(id, session?.user.id, prisma);

    return {
        props: {
            video,
            videos,
            userHasLiked,
            likes: videoLikes,
            videoAuthorId: video.authorId,
            subscribers: subscriberCount,
        },
    };
};
