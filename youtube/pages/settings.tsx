import Head from 'next/head';
import { useSession } from 'next-auth/react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
// import { prisma } from '../lib/prisma';
import { Button } from 'flowbite-react';
import { SyntheticEvent, useState } from 'react';
import SideMenu from '../components/SideMenu';
import NavBar from '../components/NavBar';
import Popup from '../components/Popup';
import UploadAvatar from '../components/forms/UploadAvatar';

export default function Settings() {
    const { data: session, status } = useSession();
    const [visibleModal, setVisibleModal] = useState(false);
    // const router = useRouter();
    // if (!session) router.push('/');

    const handleAvatarUpload = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log('upload image');
    };
    return (
        <div className="relative">
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
                    <div className="bg-gray-900 w-full h-full p-4 my-4 flex justify-between">
                        <p className="text-xl dark:text-white">Profile: {session?.user.name}</p>
                        <Button onClick={() => setVisibleModal(true)}> Upload</Button>
                    </div>
                </div>

                <Popup heading="Upload an Avatar" show={visibleModal} close={() => setVisibleModal(false)}>
                    <UploadAvatar submit={handleAvatarUpload} />
                </Popup>
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
