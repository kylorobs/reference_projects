export const getTweets = (prisma, amount) => {
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
    take: amount,
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

export const getUserTweets = (id, prisma) => {
  return prisma.tweet.findMany({
    where: {
      authorId: parseInt(id),
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
};

export const getTweet = (id, prisma) => {
  return prisma.tweet.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      author: true,
    },
  });
};

export const deleteTweet = (id, prisma) => {
  return prisma.tweet.delete({
    where: {
      id: parseInt(id),
    },
  });
};
