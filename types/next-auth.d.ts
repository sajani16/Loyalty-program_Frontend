import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    userType: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      userType: string;
    };
  }
}
