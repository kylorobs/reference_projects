import type { Comment, Post } from '@prisma/client';
import moment from 'moment';
import { useState } from 'react';
import { CommentExtended, PostWithAuthor } from '../lib/data';
import NewComment from './NewComment';

const SingleComment = ({ comment, post }: { comment: CommentExtended; post: PostWithAuthor }) => {
    const [showReply, setShowReply] = useState(false);
    return (
        <div className=" mt-6">
            <p>
                {comment.authorId} {moment(new Date(comment.createdAt)).fromNow()}
            </p>
            <p>{comment.content}</p>
            {showReply ? (
                <div className="pl-10">
                    <NewComment callback={() => setShowReply(false)} post={post} comment={comment} />
                </div>
            ) : (
                <div
                    tabIndex={0}
                    role="button"
                    className="underline text-sm cursor-pointer"
                    onClick={() => setShowReply(true)}
                    onKeyDown={() => setShowReply(true)}
                >
                    reply
                </div>
            )}
        </div>
    );
};

export default function Comments({ comments, post }: { comments: CommentExtended[]; post: PostWithAuthor }) {
    if (!comments) return null;
    return (
        <>
            {comments.map((comment: CommentExtended, index) => {
                const commentsExtended = comment.comments as CommentExtended[];
                console.log(commentsExtended);
                return (
                    <>
                        <SingleComment key={index} comment={comment} post={post} />
                        {comment.comments && (
                            <div className="pl-10">
                                <Comments comments={commentsExtended} post={post} />
                            </div>
                        )}
                    </>
                );
            })}
        </>
    );
}
