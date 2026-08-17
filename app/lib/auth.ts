import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ExtendedUser extends User {
  id: string;
  email: string;
  name: string;
  userType: string;
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!API_URL) {
          throw new Error("Missing API base URL");
        }

        // Make sure email and password were provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Send login request to your Express backend
        const res = await fetch(`${API_URL}/user/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const result = await res.json();

        // Backend rejected login
        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "Invalid credentials");
        }

        // Get user returned by your backend
        const apiUser = result.data?.user;

        if (!apiUser) {
          throw new Error("User data not found");
        }

        // Give NextAuth the user information
        return {
          id: apiUser.id || apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          userType: apiUser.userType,
          accessToken: result.data.token,
        } as ExtendedUser;
      },
    }),
  ],

  // NextAuth manages the session using JWT
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Runs when NextAuth creates/updates its JWT
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;

        token.user = {
          id: extendedUser.id,
          email: extendedUser.email,
          name: extendedUser.name,
          userType: extendedUser.userType,
        };

        token.accessToken = extendedUser.accessToken;
      }

      return token;
    },

    // Runs when your application asks for the session
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as ExtendedUser;
      }

      session.accessToken = token.accessToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};