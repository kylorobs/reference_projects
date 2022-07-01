import type { VideoArr } from '../types';
import Video from './Video';

export default function Videos({ videos }: { videos: VideoArr }) {
    if (!videos) return null;

    return (
        <div className="flex flex-wrap bg-gray-900">
            {videos.map((video, index) => (
                <div className="w-full md:w-1/2 lg:w-1/3" key={index}>
                    <Video video={video} />
                </div>
            ))}
        </div>
    );
}
