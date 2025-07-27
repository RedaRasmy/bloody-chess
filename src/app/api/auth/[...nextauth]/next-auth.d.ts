import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      playerId : string
      username: string;
      email: string;
      [key: string]: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    email: string
    username: string
    playerId: string
    lastUpdated: string
  }
}