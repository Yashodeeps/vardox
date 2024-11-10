import { dbconnect } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { customAlphabet } from "nanoid";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const prisma = await dbconnect();
      if (account?.provider === "google") {
        const email = user.email;

        if (!email) {
          return false;
        }
        const existingUser = await prisma.user.findFirst({
          where: {
            email: profile?.email || "",
          },
        });
        if (existingUser) {
          console.log("User already exists");
          return true;
        }

        console.log("Creating new user");

        const customNanoId = customAlphabet(
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          8
        );
        const customId = customNanoId();

        const newUser = await prisma.user.create({
          data: {
            email: profile?.email || "",
            name: profile?.name,
            profile: profile?.image,
            identifier: customId,
            password: randomUUID(),
          },
        });

        if (newUser) {
          return true;
        }
      }

      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
      }
      return token;
    },

    async session({ session }) {
      return session;
    },
  },
};
