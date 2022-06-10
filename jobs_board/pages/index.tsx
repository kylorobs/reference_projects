import { NextPageContext } from 'next';
import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getJobs } from '../lib/data';
import type { JobWithAuthor } from '../lib/data';
import { prisma } from '../lib/prisma';
import Jobs from '../components/Jobs';

const Home: React.FC<{ jobs: JobWithAuthor[] }> = ({ jobs }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (session && !session.user.name) {
        router.push('/setup');
    }

    console.log(session);

    return (
        <>
            {!session && <Link href="/api/auth/signin">login</Link>}
            <div className="mt-10">
                <div className="text-center p-4 m-4">
                    <h2 className="mb-10 text-4xl font-bold">Find a job!</h2>
                </div>
                <div className="flex justify-center">
                    <Link href="/new">
                        <button
                            type="button"
                            className="border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black "
                        >
                            click here to post a new job
                        </button>
                    </Link>
                    <Link href="/dashboard">
                        <button
                            type="button"
                            className="ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black "
                        >
                            see all the jobs you posted
                        </button>
                    </Link>
                </div>
                <Jobs jobs={jobs} isDashboard={false} />
            </div>
        </>
    );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
    let jobs = await getJobs(prisma);
    jobs = JSON.parse(JSON.stringify(jobs)) as JobWithAuthor[];

    return {
        props: {
            jobs,
        },
    };
}
