// import Head from 'next/head'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma from '../lib/prisma';
import { getTweets } from '../lib/data.js';
import Tweets from '../components/Tweets';

export default function Welcome({ tweets }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return null;
  }

  // if (session && session.user) {
  //   router.push('/home');
  // }
  return (
    <div className="mt-10">
      <Tweets tweets={tweets.slice(0, 3)} />
      <p className="text-center p-4 border m-4">
        <h2 className="mb-10">Join the conversation!</h2>
        <Link href="/api/auth/signin">
          <a className="border px-8 py-2 mt-5 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover-darker">
            login
          </a>
        </Link>
      </p>
    </div>
  );
}

export async function getServerSideProps() {
  let tweets = await getTweets(prisma, 3);
  tweets = JSON.parse(JSON.stringify(tweets));

  return {
    props: {
      tweets,
    },
  };
}
