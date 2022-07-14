import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Button } from 'flowbite-react';
import { Channel, getSubscribersCount, getUser, getVideos } from '../../lib/data';
import { prisma } from '../../lib/prisma';
import type { VideoArr } from '../../types';

const Videos = dynamic(() => import('../../components/Videos'), { ssr: false });
const SideMenu = dynamic(() => import('../../components/SideMenu'), { ssr: false });
const NavBar = dynamic(() => import('../../components/NavBar'), { ssr: false });

export default function ChannelPage({
    videos,
    isOwner,
    channelData,
    subscribers,
}: {
    videos: VideoArr;
    isOwner: boolean;
    channelData: Channel;
    subscribers: number | string;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSubscribe = async () => {
        await fetch(`/api/subscribe?channelId=${channelData.id}`, {
            method: 'PUT',
        });

        router.reload();
    };

    return (
        <div>
            <Head>
                <title>{channelData.name}</title>
                <meta name="description" content="A great YouTube Clone" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar profileSrc={session?.user.image || (session && 'https://placeimg.com/400/400/nature') || ''} />
            <main className="flex dark:bg-slate-800">
                <SideMenu signedIn={!!session} />
                <div className=" dark:bg-slate-800 h-full my-0 p-4">
                    <div className="flex p-2">
                        <div className="pr-4">
                            <div className="w-20">
                                <img className="rounded-full" alt="logo" src={channelData.image} />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg text-gray-400">{channelData.username}</p>
                            <p className="text-lg text-gray-400">
                                <div>{subscribers} subscribers</div>
                            </p>
                        </div>
                    </div>
                    <Button size="lg" onClick={handleSubscribe}>
                        Subscribe
                    </Button>
                </div>
                <div className="w-5/6">
                    <h1 className="text-xl text-center m-4 text-white">
                        Welcome to the {channelData.username} channel
                    </h1>
                    {videos.length === 0 && <p className="flex justify-center mt-20">No videos found!</p>}
                    <Videos videos={videos} />
                </div>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.params as { id: string };

    let videos = await getVideos({ userId: id }, prisma);
    videos = JSON.parse(JSON.stringify(videos)) as VideoArr;
    console.log({ videos });

    let user = await getUser(id, prisma);
    user = JSON.parse(JSON.stringify(user)) as Channel;

    const subscribers = await getSubscribersCount(id, prisma);
    return {
        props: {
            videos,
            isOwner: session?.user.id === id,
            channelData: user,
            subscribers,
        },
    };
};
