import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Tweets from '../../../components/Tweets.js';
import NewReply from '../../../components/NewReply.js';
import { getReplies, getTweet } from '../../../lib/data.js';
import prisma from '../../../lib/prisma';
import Tweet from '../../../components/Tweet';

export default function SingleTweet({ tweet, replies }) {
  const { data: session } = useSession();
  const router = useRouter();

  console.log(session);

  return (
    <div>
      <Tweet tweet={tweet} />

      {session && session.user.email === tweet.author.email && (
        <div className="flex justify-center text-center">
          <button
            type="button"
            className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:text-red-500  "
            onClick={async () => {
              const res = await fetch('/api/tweet', {
                body: JSON.stringify({
                  id: tweet.id,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'DELETE',
              });

              if (res.status === 401) {
                alert('Unauthorized');
              }
              if (res.status === 200) {
                router.push('/home');
              }
            }}
          >
            delete
          </button>
        </div>
      )}
      <Tweets tweets={replies} />
      <NewReply tweet={tweet} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  let tweet = await getTweet(params.id, prisma);
  tweet = JSON.parse(JSON.stringify(tweet));

  let replies = await getReplies(params.id, prisma);
  replies = JSON.parse(JSON.stringify(replies));

  return {
    props: {
      tweet,
      replies,
    },
  };
}
