import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function NewTweet({ tweets, setTweets }) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  if (!session) return null;

  return (
    <form
      className="py-8 max-w-3xl m-auto"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!content) {
          alert('No content');
          return;
        }

        const res = await fetch('/api/tweet', {
          body: JSON.stringify({
            content,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        const tweet = await res.json();
        setTweets([tweet, ...tweets]);

        // router.reload(window.location.pathname); // very inefficient
      }}
    >
      <div className="flex">
        <div className="flex-1 pt-2 mt-2">
          <textarea
            className="border p-4 w-full text-lg font-medium bg-transparent outline-none border-cyan-500 "
            rows={2}
            cols={50}
            placeholder="What's happening?"
            name="content"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 mb-5">
          <button type="submit" className="border float-right px-8 py-2 mt-0 mr-2 font-bold rounded-full">
            Tweet
          </button>
        </div>
      </div>
    </form>
  );
}
