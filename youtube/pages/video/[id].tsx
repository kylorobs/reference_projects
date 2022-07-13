import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { getSubscribersCount, getVideo, getVideos } from '../../lib/data';
import { prisma } from '../../lib/prisma';
import type { VideoT, VideoArr } from '../../types';
import Video from '../../components/Video';
import NavBar from '../../components/NavBar';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function SingleVideo({
    video,
    videos,
    subscribers,
}: {
    video: VideoT;
    videos: VideoArr;
    subscribers: number;
}) {
    if (!video) return <p className="text-center p-5">Video does not exist 😞</p>;

    return (
        <>
            <Head>
                <title>YouTube Clone</title>
                <meta name="description" content="A great YouTube Clone" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar />
            <div className=" dark:bg-slate-800 h-full my-0 p-4">
                <div className="flex p-2">
                    <div className="pr-4">
                        <div className="w-20">
                            <img className="rounded-full" alt="logo" src={video.author.image} />
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
                        <div className="flex ">
                            <div>
                                <p className="text-2xl font-bold text-white">{video.title}</p>

                                <div className="text-gray-400">{video.views} views · </div>
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
    const { id } = context.params as { id: string };
    let video = await getVideo(id, prisma);
    video = JSON.parse(JSON.stringify(video)) as VideoT;

    let videos = await getVideos({ take: 3 }, prisma);
    videos = JSON.parse(JSON.stringify(videos)) as VideoArr;

    const subscriberCount = await getSubscribersCount(video.authorId, prisma);

    return {
        props: {
            video,
            videos,
            subscribers: subscriberCount,
        },
    };
};
