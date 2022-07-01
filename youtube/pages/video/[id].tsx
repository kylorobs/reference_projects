import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getVideo, getVideos } from '../../lib/data';
import { prisma } from '../../lib/prisma';
import type { VideoT, VideoArr } from '../../types';
import Video from '../../components/Video';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function SingleVideo({ video, videos }: { video: VideoT; videos: VideoArr }) {
    if (!video) return <p className="text-center p-5">Video does not exist 😞</p>;

    return (
        <>
            <header className="h-14 flex pt-5 px-5 pb-2">
                <Link href="/">
                    <a className="underline">Home</a>
                </Link>

                <div className="grow" />
            </header>

            <div className="h-screen flex">
                <div className="flex w-full md:w-2/3 flex-col mb-4 border-t border-r border-b border-3 border-black pl-0 bg-black">
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
                                <p className="text-2xl font-bold ">{video.title}</p>

                                <div className="text-gray-400">{video.views} views · </div>
                            </div>
                        </div>

                        <div className="flex justify-between border-t border-gray-500 mt-5 pt-5">
                            <Link href={`/channel/${video.author.username || ''}`}>
                                <a className=" flex ">
                                    {video.author.image && (
                                        <img className="w-16 h-16 mt-2 mr-2 rounded-full" src={video.author.image} />
                                    )}
                                    <span className="mt-6 ml-2 text-xl text-white">{video.author.name}</span>
                                </a>
                            </Link>
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

    return {
        props: {
            video,
            videos,
        },
    };
};
