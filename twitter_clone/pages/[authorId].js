import Tweets from '../components/Tweets';
import prisma from '../lib/prisma';
import { getUserTweets } from '../lib/data';

export default function UserProfile({ id, tweets }) {
  return (
    <div dataAuthorId={id}>
      <p className="text-center p-5">Welcome to the Profile of {tweets[0].author.name}</p>
      <Tweets tweets={tweets} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  let tweets = await getUserTweets(params.authorId, prisma);
  tweets = JSON.parse(JSON.stringify(tweets));

  return {
    props: {
      id: params.authorId,
      tweets,
    },
  };
}
