import Head from 'next/head';
import { useSession } from 'next-auth/react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
// import { prisma } from '../lib/prisma';
import SideMenu from '../components/SideMenu';
import NavBar from '../components/NavBar';

export default function Settings() {
    const { data: session, status } = useSession();
    const router = useRouter();
    if (!session) router.push('/');
    return (
        <div>
            <Head>
                <title>User Name</title>
                <meta name="description" content="A great YouTube Clone" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar profileSrc={session?.user.image || (session && 'https://placeimg.com/400/400/nature') || ''} />
            <main className="flex dark:bg-slate-800 h-full min-h-screen">
                <SideMenu signedIn={!!session} />
                <div className="h-full w-full mx-16 my-8">
                    <div className="bg-gray-900 w-full h-full p-4 my-4">
                        <p className="text-xl dark:text-white">Username: {session?.user.name}</p>
                    </div>
                    <div className="bg-gray-900 w-full h-full p-4 my-4 ">
                        <p className="text-xl dark:text-white">Profile: {session?.user.name}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

// export async function getServerSideProps() {
//     let videos = await getVideos({}, prisma);
//     videos = JSON.parse(JSON.stringify(videos)) as VideoArr;

//     return {
//         props: {
//             videos,
//         },
//     };
// }
