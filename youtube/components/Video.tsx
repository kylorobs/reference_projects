import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { VideoT } from '../types';

export default function Video({ video }: { video: VideoT }) {
    dayjs.extend(relativeTime);
    return (
        <Link href={`/video/${video.id}`}>
            <div className="">
                <div className="px-5 pb-5">
                    {video.thumbnail && (
                        <Image alt="" className="mb-2 cursor-pointer" src={video.thumbnail} width="800" height="450" />
                    )}
                    <p className="text-lg font-bold text-white">{video.title}</p>
                    <div className="flex p-2">
                        <div className="pr-4">
                            <div className="w-10">
                                <img className="rounded-full" alt="logo" src={video.author.image} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">{video.author.name}</p>
                            <p className="text-xs text-gray-400">
                                {video.views} Views | {dayjs().to(dayjs(video.createdAt))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
