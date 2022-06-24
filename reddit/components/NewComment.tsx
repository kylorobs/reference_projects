import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import type { Comment } from '@prisma/client';
import { PostWithAuthor } from '../lib/data';
import { createComment } from '../lib/queries';

export default function NewComment({
    post,
    comment,
    callback,
}: {
    post: PostWithAuthor;
    comment?: Comment;
    callback?: () => void;
}) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const { mutate, isError, isLoading } = useMutation(createComment, {
        onSuccess: () => {
            queryClient.invalidateQueries('comments');
        },
    });

    return (
        <form
            className="flex flex-col mt-10"
            onSubmit={(e) => {
                e.preventDefault();
                if (!content) {
                    alert('Enter some text in the comment');
                    return;
                }
                mutate(
                    { postId: +post.id, parentId: comment?.id, content },
                    {
                        onSuccess: () => {
                            setContent('');
                            if (callback) callback();
                        },
                    }
                );
            }}
        >
            <textarea
                className="border border-gray-700 p-4 w-full text-lg font-medium bg-transparent outline-none color-primary "
                rows={1}
                cols={50}
                value={content}
                placeholder="Add a comment"
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-5">
                <button type="submit" className="border border-gray-700 px-8 py-2 mt-0 mr-8 font-bold ">
                    Comment
                </button>
            </div>
        </form>
    );
}
