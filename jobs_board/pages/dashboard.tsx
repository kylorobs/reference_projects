import { getSession, useSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import { Job, User } from '.prisma/client';
import Link from 'next/link';
import { getAllJobsPosted, getCompany, JobWithAuthor, getUserApplications, ApplicationExtended } from '../lib/data';
import { prisma } from '../lib/prisma';
import Jobs from '../components/Jobs';

export default function Dashboard({
    jobs,
    user,
    applications,
}: {
    jobs: JobWithAuthor[];
    user: User;
    applications: ApplicationExtended[];
}) {
    const { data: session, status } = useSession();

    return (
        <div className="mt-10">
            <div className="text-center p-4 m-4">
                <h2 className="mb-10 text-4xl font-bold">Dashboard</h2>
                {user.company && <span className="bg-black text-white uppercase text-sm p-2 ">Company</span>}
                {session && (
                    <p className="mt-10 mb-10 text-2xl font-normal">
                        {user.company ? 'all the jobs you posted' : 'your applications'}
                    </p>
                )}
            </div>
            {user.company ? (
                <Jobs jobs={jobs} isDashboard />
            ) : (
                <>
                    {applications.map((application) => {
                        return (
                            <div key={application.id} className="mb-4 mt-20 flex justify-center">
                                <div className="pl-16 pr-16 -mt-6 w-1/2">
                                    <Link href={`/job/${application.job.id}`}>
                                        <a className="text-xl font-bold underline">{application.job.title}</a>
                                    </Link>
                                    <h2 className="text-base font-normal mt-3">{application.coverletter}</h2>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    let user = (await getCompany(session!.user.id, prisma)) as User;
    user = JSON.parse(JSON.stringify(user)) as User;

    let jobs: JobWithAuthor[] = [];
    let applications: ApplicationExtended[] = [];

    if (user.company) {
        jobs = await getAllJobsPosted(user.id, prisma);
        jobs = JSON.parse(JSON.stringify(jobs)) as JobWithAuthor[];
    } else {
        applications = await getUserApplications(user.id, prisma);
        applications = JSON.parse(JSON.stringify(applications)) as ApplicationExtended[];
    }

    return {
        props: {
            jobs,
            user,
            applications,
        },
    };
}
