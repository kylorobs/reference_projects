import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getVideos } from '../lib/data';
import { prisma } from '../lib/prisma';
import type { VideoArr } from '../types';
import Videos from '../components/Videos';
import SideMenu from '../components/SideMenu';
import NavBar from '../components/NavBar';

export default function Home({ videos }: { videos: VideoArr }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    return (
        <div>
            <Head>
                <title>YouTube Clone</title>
                <meta name="description" content="A great YouTube Clone" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar profileSrc={session?.user.image || (session && 'https://placeimg.com/400/400/nature') || ''} />
            <main className="flex dark:bg-slate-800">
                <SideMenu signedIn={!!session} />
                <div className="w-5/6">
                    {videos.length === 0 && <p className="flex justify-center mt-20">No videos found!</p>}
                    <Videos videos={videos} />
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps() {
    let videos = await getVideos({}, prisma);
    videos = JSON.parse(JSON.stringify(videos)) as VideoArr;

    return {
        props: {
            videos,
        },
    };
}
