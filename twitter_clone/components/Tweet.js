import timeago from '../lib/timeago';

export default function Tweet({ tweet }) {
  console.log(tweet);
  return (
    <p>
      {timeago.format(new Date(tweet.createdAt))} {tweet.content}
    </p>
  );
}
