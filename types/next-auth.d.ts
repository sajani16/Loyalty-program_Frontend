import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: string;
      role?: string | Record<string, unknown>;
    };
    accessToken: string;
    accessTokenExpires?: number;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    userType: string;
    role?: string | Record<string, unknown>;
    accessToken: string;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    accessTokenExpires?: number;

    user: {
      id: string;
      email: string;
      name: string;
      userType: string;
      role?: string | Record<string, unknown>;
    };
  }
}
