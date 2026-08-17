import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ExtendedUser extends User {
  id: string;
  email: string;
  name: string;
  userType: string;
  role?: string | Record<string, unknown>;
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
        userType: {
          label: "User Type",
          type: "text",
        },
      },

      async authorize(credentials) {
        if (!API_URL) {
          throw new Error("Missing API base URL");
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            userType: credentials.userType || "customer",
          }),
        });

        const result = await res.json();

        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "Invalid credentials");
        }

        const apiUser = result.data?.user;

        if (!apiUser) {
          throw new Error("User data not found");
        }

        return {
          id: apiUser.id || apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          userType: apiUser.userType || credentials.userType || "customer",
          role: apiUser.role,
          accessToken: result.data.accessToken || result.data.token,
        } as ExtendedUser;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;

        token.user = {
          id: extendedUser.id,
          email: extendedUser.email,
          name: extendedUser.name,
          userType: extendedUser.userType,
          role: extendedUser.role,
        };

        token.accessToken = extendedUser.accessToken;
      }

      return token;
    },

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