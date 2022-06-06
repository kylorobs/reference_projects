import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LoadMore from '../components/LoadMore';
import { getTweets } from '../lib/data';
import prisma from '../lib/prisma';
import Tweets from '../components/Tweets';
import NewTweet from '../components/NewTweet';

export default function Home({ initialTweets }) {
  const [tweets, setTweets] = useState(initialTweets);
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  if (status === 'loading') {
    return <p>loading...</p>;
  }

  if (loading) {
    return null;
  }

  if (!session || !session.user) {
    router.push('/');
  }

  if (!session.user.name) router.push('/setup');

  return (
    <>
      <NewTweet tweets={tweets} setTweets={setTweets} />
      <Tweets tweets={tweets} />
      <LoadMore tweets={tweets} setTweets={setTweets} />
    </>
  );
}

export async function getServerSideProps() {
  let tweets = await getTweets(prisma, 2);
  // createdAt is a returned by Prisma as a Date object, but getServerSideProps returns data as JSON-encoded, and JSON does not support Date objects.
  // So what we do is, we transform that object into a string, and then back into an object
  tweets = JSON.parse(JSON.stringify(tweets));

  return {
    props: {
      initialTweets: tweets,
    },
  };
}
