import { GetServerSideProps } from 'next';
import type { User } from '@prisma/client';
import Link from 'next/link';
import { getCompany, getCompanyJobs, JobWithAuthor } from '../../lib/data';
import { prisma } from '../../lib/prisma';
import Job from '../../components/Job';

type CProps = {
    jobs: JobWithAuthor[];
    company: User;
};

export default function Company({ jobs, company }: CProps) {
    return (
        <div className="mt-10">
            <div className="text-center p-4 m-4">
                <Link href="/">
                    <a href="" className="mb-10 text-sm font-bold underline">
                        back
                    </a>
                </Link>
            </div>
            <div className="text-center p-4 m-4">
                <h2 className="mb-10 text-4xl font-bold">Profile of {company.name}</h2>
            </div>

            <div className="mb-4 mt-20">
                <div className="pl-16 pr-16 -mt-6">
                    <p className="text-center text-xl font-bold">Company jobs</p>
                    {jobs.map((job, index) => (
                        <Job key={index} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;
    let company = await getCompany(id, prisma);
    let jobs = await getCompanyJobs(id, prisma);
    company = JSON.parse(JSON.stringify(company)) as User;
    jobs = JSON.parse(JSON.stringify(jobs)) as JobWithAuthor[];

    return {
        props: {
            jobs,
            company,
        },
    };
};
