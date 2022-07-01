# Youtube Clone

This is a repo containing boiler plate for starting a new NextJS application. It contains the following:

- Next JS with Typescript 
- Prisma as ORM
- NextAuth for authentication
- MailTrap for email testing
- tailwind for styling

## Getting Started

1. Install dependencies
2. Setup an account in MailTrap
3. Create a database connection
3. Create a `.env` file with the values defined in the `.env.template` file
4. Run the prisma command

```bash
npx prisma migrate dev
```


## Dynamic Prisma Args
Struggled with correct typings to get this right
```js
export const getVideos = async (
    options: { take?: number },
    prisma: PrismaClient
): Promise<(Video & { author: User })[]> => {
    const data = {
        where: {},
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
        include: {
            author: true,
        },
    } as Partial<Prisma.VideoFindManyArgs>;

    if (options.take) data.take = options.take;
    const res = (await prisma.video.findMany(data)) as (Video & { author: User })[];
    return res;
}
```