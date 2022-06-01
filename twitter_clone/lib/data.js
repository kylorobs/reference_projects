export const getTweets = (prisma) => {
  return prisma.tweet.findMany({
    where: {},
    orderBy: [
      {
        id: 'desc',
      },
    ],
    include: {
      author: true,
    },
  });
};

export const getUserNames = (prisma) => {
  return prisma.user.findMany({
    where: {},
    orderBy: [
      {
        id: 'desc',
      },
    ],
    select: {
      name: true,
    },
  });
};
