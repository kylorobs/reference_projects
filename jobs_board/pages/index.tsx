import { NextPageContext } from 'next';
import React from 'react';
import { getJobs } from '../lib/data';
import type { JobWithAuthor } from '../lib/data';
import { prisma } from '../lib/prisma';
import Jobs from '../components/Jobs';

const Home: React.FC<{ jobs: JobWithAuthor[] }> = ({ jobs }) => {
    return (
        <div className="mt-10">
            <div className="text-center p-4 m-4">
                <h2 className="mb-10 text-4xl font-bold">Find a job!</h2>
            </div>
            <Jobs jobs={jobs} />
        </div>
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
