import Image from 'next/image';
import Link from 'next/link';
import timeago from '../lib/timeago';

export default function Tweet({ tweet }) {
  return (
    <div className="ml-4 mt-8 mb-8 flex content-center">
      {tweet.author.image && (
        <div className="min-w-fit h-auto">
          <Image
            className="w-64 h-64 rounded-full "
            src={tweet.author.image}
            alt={tweet.author.name}
            width="40"
            height="40"
          />
        </div>
      )}
      <div className="ml-4">
        <p className="text-cyan-500">{tweet.content}</p>
        <p className="text-gray-600">
          <Link href={`/${tweet.author.name}/status/${tweet.id}`}>{timeago.format(new Date(tweet.createdAt))}</Link> by{' '}
          <Link href={`/${tweet.authorId}`}>{tweet.author.name}</Link>
        </p>
      </div>
    </div>
  );
}
