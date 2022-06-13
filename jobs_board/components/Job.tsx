import Link from 'next/link';
import { useRouter } from 'next/router';
import type { JobWithAuthor } from '../lib/data';

const Job: React.FC<{ job: JobWithAuthor; isDashboard: boolean }> = ({ job, isDashboard }) => {
    const router = useRouter();
    const togglePublish = async (task: 'publish' | 'unpublish') => {
        await fetch('/api/job', {
            body: JSON.stringify({
                id: job.id,
                task,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });
        router.reload();
    };

    return (
        <div className="mb-4 mt-20 pl-16 pr-16">
            <Link href={`/job/${job.id}`}>
                <a className="text-xl font-bold underline">{job.title}</a>
            </Link>
            <h2 className="text-base font-normal mt-3">{job.description}</h2>
            <div className="mt-4">
                <h4 className="inline">Posted by</h4>
                {isDashboard && job.published && (
                    <span
                        tabIndex={0}
                        role="button"
                        onClick={() => togglePublish('unpublish')}
                        onKeyUp={() => togglePublish('unpublish')}
                        className="bg-black text-white uppercase text-sm p-2 mr-5"
                    >
                        ✅ Published
                    </span>
                )}
                {isDashboard && !job.published && (
                    <span
                        tabIndex={0}
                        role="button"
                        onClick={() => togglePublish('publish')}
                        onKeyUp={() => togglePublish('publish')}
                        className="bg-black text-white uppercase text-sm p-2 mr-5"
                    >
                        ❌ Unpublished
                    </span>
                )}
                <div className="ml-3 -mt-6 inline">
                    <span>
                        <p>
                            <span className="text-base font-medium color-primary underline">{job.author.name}</span>
                        </p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Job;
