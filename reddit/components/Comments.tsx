import type { Comment } from '@prisma/client';
import moment from 'moment';

const SingleComment = ({ comment }: { comment: Comment }) => {
    return (
        <div className=" mt-6">
            <p>
                {comment.authorId} {moment(new Date(comment.createdAt)).fromNow()}
            </p>
            <p>{comment.content}</p>
        </div>
    );
};

export default function Comments({ comments }: { comments: Comment[] }) {
    if (!comments) return null;
    return (
        <>
            {comments.map((comment, index) => (
                <SingleComment key={index} comment={comment} />
            ))}
        </>
    );
}
