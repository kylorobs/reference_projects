import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Pagination } from 'flowbite-react';
import { useState } from 'react';
import { getVideos } from '../lib/data';
import { prisma } from '../lib/prisma';
import type { VideoArr } from '../types';
import Videos from '../components/Videos';
import SideMenu from '../components/SideMenu';
import NavBar from '../components/NavBar';
import { paginationAmount } from '../lib/config';

export default function Home({ inititalVideos }: { inititalVideos: VideoArr }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [videos, setVideos] = useState(inititalVideos);
    const [reachedEnd, setReachedEnd] = useState(false);

    const handlePageChange = async (e: any) => {
        const url = `/api/videos?skip=${videos.length}`;
        const res = await fetch(url);
        const data = (await res.json()) as VideoArr;
        setVideos([...videos, ...data]);
        if (data.length < paginationAmount) setReachedEnd(true);
    };

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
                    {!reachedEnd && (
                        <div className="flex items-center justify-center text-center">
                            <button
                                onClick={handlePageChange}
                                type="button"
                                className="py-2.5 px-5 mr-2 my-8 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                                Load more
                            </button>
                        </div>
                    )}
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
            inititalVideos: videos,
        },
    };
}
