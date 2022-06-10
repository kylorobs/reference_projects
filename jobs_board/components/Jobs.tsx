import type { Job as JobT } from '@prisma/client';
import Job from './Job';
import type { JobWithAuthor } from '../lib/data';

const Jobs: React.FC<{ jobs: JobWithAuthor[]; isDashboard: boolean }> = ({ jobs, isDashboard }) => {
    if (!jobs) return null;

    return (
        <>
            {jobs.map((job, index) => (
                <Job key={index} job={job} isDashboard={isDashboard} />
            ))}
        </>
    );
};

export default Jobs;
