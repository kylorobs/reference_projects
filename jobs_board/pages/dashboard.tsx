import { getSession, useSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import { User } from '.prisma/client';
import Link from 'next/link';
import {
    getAllJobsPosted,
    getCompany,
    getUserApplications,
    ApplicationExtended,
    JobWithApplications,
} from '../lib/data';
import { prisma } from '../lib/prisma';
import Job from '../components/Job';

export default function Dashboard({
    jobs,
    user,
    applications,
}: {
    jobs: JobWithApplications[];
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
                <div>
                    {jobs.map((job, index) => (
                        <>
                            <Job key={index} job={job} isDashboard />

                            <div className="mb-4 mt-20">
                                <div className="pl-16 pr-16 -mt-6">
                                    {job.applications && job.applications.length === 0 ? (
                                        <p className="mb-10 text-2xl font-normal">No applications so far 😞</p>
                                    ) : (
                                        <p className="mb-10 text-2xl font-normal">
                                            {job.applications.length} applications
                                        </p>
                                    )}

                                    {job.applications?.map((application, indexI) => (
                                        <>
                                            <h2 className="text-base font-normal mt-3" key={indexI}>
                                                <span className="text-base font-bold mt-3 mr-3">
                                                    {application.author.name}
                                                </span>
                                                {application.author.email}
                                            </h2>
                                            <p className="text-lg font-normal mt-2 mb-3">{application.coverletter}</p>
                                            <hr />
                                        </>
                                    ))}
                                </div>
                            </div>
                        </>
                    ))}
                </div>
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

    let jobs: JobWithApplications[] = [];
    let applications: ApplicationExtended[] = [];

    if (user.company) {
        jobs = await getAllJobsPosted(user.id, prisma);
        jobs = JSON.parse(JSON.stringify(jobs)) as JobWithApplications[];
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
