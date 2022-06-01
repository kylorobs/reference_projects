import timeago from '../lib/timeago';

export default function Tweet({ tweet }) {
  return (
    <div className="m-4">
      <p className="text-cyan-500">{tweet.content}</p>
      <p className="text-gray-600">
        {timeago.format(new Date(tweet.createdAt))} by {tweet.author.name}
      </p>
    </div>
  );
}
