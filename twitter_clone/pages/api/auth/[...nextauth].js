import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  database: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  // USE THIS IF YOU WANT TO INCLUDE THE UNQIUE USERID IN THE SESSION, INSTEAD OF USER EMAIL AS IDENITIFER
  // callbacks: {
  //   session: async (session) => {
  //     session.session.user.id = session.user.id;
  //     return Promise.resolve(session);
  //   },
  // },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: true,
  adapter: PrismaAdapter(prisma),
});
