export default function LoadMore({ tweets, setTweets }) {
  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        className="mb-16 justify-self-center border px-8 py-2 mt-0 mr-2 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover "
        onClick={async () => {
          const lastTweetId = tweets[tweets.length - 1].id;
          const rest = await fetch(`/api/tweets?take=2&cursor=${lastTweetId}`);
          const data = await rest.json();
          setTweets([...tweets, ...data]);
        }}
      >
        Load more
      </button>
    </div>
  );
}
