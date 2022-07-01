import Image from 'next/image';
import Link from 'next/link';
import type { VideoT } from '../types';

export default function Video({ video }: { video: VideoT }) {
    return (
        <Link href={`video/${video.id}`}>
            <div className="">
                <div className="px-5 pb-5">
                    {video.thumbnail && (
                        <Image alt="" className="mb-2 cursor-pointer" src={video.thumbnail} width="800" height="450" />
                    )}
                    <p className="text-lg font-bold text-white">{video.title}</p>
                </div>
            </div>
        </Link>
    );
}
