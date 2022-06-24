import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import type { Subreddit } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { getSubreddit } from '../../../lib/data';
import { prisma } from '../../../lib/prisma';

export default function NewPost({ subreddit }: { subreddit: Subreddit }) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<Blob | string>('');
    const [imageURL, setImageURL] = useState('');
    const { data: session, status } = useSession();

    const loading = status === 'loading';

    if (loading) {
        return null;
    }

    if (!session) return <p className="text-center p-5">Not logged in 😞</p>;

    if (!subreddit) return <p className="text-center p-5">Subreddit does not exist 😞</p>;

    async function submitHandler(e: React.SyntheticEvent) {
        e.preventDefault();

        if (!title) {
            alert('Enter a title');
            return;
        }
        if (!content && !image) {
            alert('Enter some text in the post');
            return;
        }

        const body = new FormData();
        body.append('image', image);
        body.append('title', title);
        body.append('content', content);
        body.append('subredditName', subreddit.name);

        const res = await fetch('/api/post', {
            body,
            method: 'POST',
        });

        console.log('REDIRECTING');
        router.push(`/r/${subreddit.name}`);
    }

    return (
        <>
            <header className="bg-black text-white h-12 flex pt-3 px-5 pb-2">
                <Link href="/">
                    <a className="underline">Home</a>
                </Link>
                <p className="grow" />
            </header>
            <header className="bg-black text-white h-12 flex pt-3 px-5 pb-2">
                <Link href={`/r/${subreddit.name}`}>
                    <a className="text-center underline">/r/{subreddit.name}</a>
                </Link>
                <p className="ml-4 text-left grow">{subreddit.description}</p>
            </header>

            <div className="flex flex-row mb-4  px-10 justify-center">
                <div className="flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 my-10">
                    <form className="flex flex-col " onSubmit={submitHandler}>
                        <h2 className="text-2xl font-bold mb-8">Create a post</h2>
                        <input
                            className="border border-gray-700 border-b-0 p-4 w-full text-lg font-medium bg-transparent outline-none  "
                            placeholder="The post title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="text-sm text-gray-600 ">
                            <label className="relative font-medium cursor-pointer underline my-3 block">
                                {!imageURL && <p className="">Upload an image</p>}
                                <img src={imageURL} />
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => {
                                        if (event.target.files && event.target.files[0]) {
                                            if (event.target.files[0].size > 3072000) {
                                                alert('Maximum size allowed is 3MB');
                                                return false;
                                            }
                                            setImage(event.target.files[0]);
                                            setImageURL(URL.createObjectURL(event.target.files[0]));
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <textarea
                            className="border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none  "
                            rows={5}
                            cols={50}
                            placeholder="The post content"
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="mt-5">
                            <button type="submit" className="border border-gray-700 px-8 py-2 mt-0 mr-8 font-bold ">
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const params = context.params as { subreddit: string };
    const subreddit = await getSubreddit(params.subreddit, prisma);

    return {
        props: {
            subreddit,
        },
    };
};
