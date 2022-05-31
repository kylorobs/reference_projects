import Tweet from './Tweet';

export default function Tweets({ tweets }) {
  if (!tweets || tweets.length < 1) return null;
  console.log(tweets);
  return (
    <>
      {tweets.map((tweet, index) => (
        <Tweet key={index} tweet={tweet} />
      ))}
    </>
  );
}
