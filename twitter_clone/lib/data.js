export const getTweets = (prisma) => {
  return prisma.tweet.findMany({
    where: {},
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });
};
