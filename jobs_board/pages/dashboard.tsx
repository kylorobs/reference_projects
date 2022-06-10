import { getSession, useSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import { Job, User } from '.prisma/client';
import { getAllJobsPosted, getCompany, JobWithAuthor } from '../lib/data';
import { prisma } from '../lib/prisma';
import Jobs from '../components/Jobs';

export default function Dashboard({ jobs, user }: { jobs: JobWithAuthor[]; user: User }) {
    const { data: session, status } = useSession();

    return (
        <div className="mt-10">
            <div className="text-center p-4 m-4">
                <h2 className="mb-10 text-4xl font-bold">Dashboard</h2>
                {user.company && <span className="bg-black text-white uppercase text-sm p-2 ">Company</span>}
                {session && user.company && <p className="mt-10 mb-10 text-2xl font-normal">all the jobs you posted</p>}
            </div>
            <Jobs jobs={jobs} isDashboard />
        </div>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    let user = (await getCompany(session!.user.id, prisma)) as User;
    user = JSON.parse(JSON.stringify(user)) as User;

    let jobs = await getAllJobsPosted(user.id, prisma);
    jobs = JSON.parse(JSON.stringify(jobs)) as JobWithAuthor[];

    return {
        props: {
            jobs,
            user,
        },
    };
}
