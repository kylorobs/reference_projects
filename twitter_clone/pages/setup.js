import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Setup() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const loading = status === 'loading';
  if (!session || !session.user) return null;
  if (loading) return null;

  if (session.user.name) router.push('/home');

  return (
    <form
      className="mt-10 ml-20"
      onSubmit={async (e) => {
        e.preventDefault();
        setError('');
        const response = await fetch('/api/setup', {
          body: JSON.stringify({
            name,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        const results = await response.json();
        if (results.message) return setError(results.message);

        session.user.name = name;
        router.push('/home');
      }}
    >
      <div className="flex-1 mb-5">
        <div className="flex-1 mb-5">Username</div>
        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} className="border p-1" />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="border px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover"
      >
        Save
      </button>
    </form>
  );
}
