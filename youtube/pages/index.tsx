import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getVideos } from '../lib/data';
import { prisma } from '../lib/prisma';
import type { VideoArr } from '../types';
import Videos from '../components/Videos';

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
            <header className="h-14 flex pt-5 px-5 pb-2">
                <div className="text-xl">
                    <p>YouTube clone</p>
                </div>
                <Link href="/api/auth/signin">
                    <a>login</a>
                </Link>
                <div className="grow" />
            </header>

            {videos.length === 0 && <p className="flex justify-center mt-20">No videos found!</p>}
            <Videos videos={videos} />
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
