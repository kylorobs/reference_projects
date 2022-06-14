import type { PostWithAuthor } from '../lib/data';
import SinglePost from './SinglePost';

const Posts = ({ posts }: { posts: PostWithAuthor[] }) => {
    if (!posts) return null;

    return (
        <>
            {posts.map((post, index) => (
                <SinglePost key={index} post={post} />
            ))}
        </>
    );
};

export default Posts;
