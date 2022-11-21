import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

//Custom 
import CredentialsProvider from 'next-auth/providers/credentials';
/* Import bcrypt */
import bcrypt from 'bcryptjs';

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  debug: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {

      session.data = { ...token };
      return session;
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    // signOut: '/signout',
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciales',
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "Ingresa tu usuario" },
        password: { label: "Password", type: "password" }
      },

      authorize: async (credentials) => { //Ignore error  

        const user = await prisma.user.findUnique({
          where: {
            usuario: credentials?.username
          },
          include: {
            persona: true
          }

        });
        if (user) {
          const isValid = await bcrypt.compare(credentials?.password as string, user.password as string);
          if (isValid) {

            return user;
          }
        }
        throw new Error('No se pudo iniciar sesión');
      }
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
