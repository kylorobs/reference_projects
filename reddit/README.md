# Reddit Clone

This is a repo cloning the basic features of the Reddit Platform

## The tools

🎨 NextJs
💾 Postgres SQL database
🐋 Prisma
🌸 React Query

Also with
- Typescript
- NextAuth for authentication
- MailTrap for email testing
- tailwind for styling
- moment for time stamps


## Caching 

Next JS will server side render the pages, which means it will fetch the data from the postgres database and populate the page server-side. But what happens if there is a change in that data? Eg a user makes a comment? 

The first 'solution' is to get the router to reload the entire page - silly, because all of the resources have to be re-fetched by the browser. 

This is where React is useful - we can store the data in state, and every time there is a change the component will re-render. But this is far from performant. What if the user navigates back and to the page? What if our client side logic mistakenly goes out of sync with the database? How can stop multiple GET requests repeating everytime a component mounts?

The introduction of a client side caching library like React Query takes care of this is for us. The tricky part was loading the server-fetched data into the hook. This didn't seem to prevent an extra unnecessary request being made from the browser, and is something I would need to look into more. This is how I solved loading the initial data:

```js
    const {
        isFetching,
        error,
        data: postData,
    } = useQuery(['comments', { postId: 4 }], () => fetchPostWithComments({ postId: post.id }), {
        initialData: post,
    });
```

## Comments within comments

One of the interesting features was to allow users to comment on other users' comments. This became particularly challenging when using both server side rendering and React Query. 

The main challenge was getting the data into the correct form.

The first step was to setup the appropriate table columns. I created a parentId field to store the first comment. I also set up a Self Relation, so that a comment can be related to an array of other Comments. The relation would be any comments which share the same parentId. This is what it looks like:

```js
model Comment {
  id        Int       @id @default(autoincrement())
  content   String
  createdAt DateTime  @default(now())
  authorId  String
  postId    Int?
  author    User      @relation(fields: [authorId], references: [id])
  post      Post?     @relation(fields: [postId], references: [id])
  parentId  Int?
  parent    Comment?  @relation("ParenComment", fields: [parentId], references: [id])
  Comment   Comment[] @relation("ParenComment")
}
```

The next step is setting up the correct query. What we want is:
1. get a post. each post to contain an array of Comments[]
2. Each Comment to also have an array of Comments[], if there are any.
3. Render the comments so they 'stack' below and sideways - ie so they look nested

### Step One

This will get the post:

```js
    const post = (await prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            author: true,
            comments: {
                where: {
                    parentId: null,
                },
                orderBy: [{ id: 'desc' }],
            },
        },
    }))
```

We make sure parentId is null, because we only want the comments applied directly to the post, and not comments to other comments. This will give us data that looks like this:

```js

{
  id: 11,
  title: 'My own post',
  content: 'With dazzling content',
  image: null,
  createdAt: 2022-06-23T05:56:17.031Z,
  authorId: 'cl4ihdv2m0051ljkuxd7p62e1',
  subredditName: 'loafer',
  author: {
    id: 'cl4ihdv2m0051ljkuxd7p62e1',
    name: 'Arkan',
    email: 'test@gmail.com',
    emailVerified: 2022-06-17T13:22:46.794Z,
    image: null,
    createdAt: 2022-06-17T13:22:46.797Z,
    updatedAt: 2022-06-17T13:22:53.306Z
  },
  comments: [
    {
      id: 26,
      content: 'yes really!',
      createdAt: 2022-06-23T14:24:35.532Z,
      authorId: 'cl4ihdv2m0051ljkuxd7p62e1',
      postId: 11,
      parentId: null
    },
  ]
}
```

## Step Two

If the post does contain comments, we now want to check if those comments contain other comments. How can we do this? For each comment, we need to go fetch all comments which have the parentId of that comment.

So that means a loop, and for each comment to recursively check and set any child comments. For this we can use a helper function:

```ts
async function fetchCommentsOfComments(
    comments: CommentExtended[],
    prisma: PrismaClient
): Promise<CommentWithComments[]> {
    return Promise.all(
        comments.map(async (comment) => {
            const extended = comment as CommentWithComments;
            extended.comments = await getComments(comment.id, prisma);
            return extended;
        })
    );
}
```
And the recursive function we need to call is this, taking the parentId as a argument:

```ts
async function getComments(parentId: number, prisma: PrismaClient): Promise<CommentWithComments[]> {
    const comments = await prisma.comment.findMany({
        where: {
            parentId,
        },
        orderBy: [
            {
                id: 'desc',
            },
        ],
        include: {
            author: true,
        },
    });

    const commentsWithComments = comments as CommentWithComments[];

    if (comments.length) return fetchCommentsOfComments(comments, prisma);

    return commentsWithComments;
}
```

## Step Three

To nest the comments, all we need to do is render the component within the component, recursively:

```ts
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


```