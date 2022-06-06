import Image from 'next/image';
import Link from 'next/link';
import timeago from '../lib/timeago';

export default function Tweet({ tweet }) {
  return (
    <Link href={`/${tweet.author.name}/status/${tweet.id}`}>
      <div className="flex content-center border-gray-200 md:border-x-2 border-b-2 p-8 max-w-3xl m-auto hover:cursor-pointer">
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
          <p className="text-gray-600">
            <Link href={`/${tweet.authorId}`}>
              <a className="text-cyan-500 hover:underline">{tweet.author.name}</a>
            </Link>{' '}
            <span className="text-sm">{timeago.format(new Date(tweet.createdAt))}</span>
          </p>
          <p>{tweet.content}</p>
        </div>
      </div>
    </Link>
  );
}
