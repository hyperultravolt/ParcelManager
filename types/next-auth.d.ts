import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      studentId?: string;
      phone?: string;
    };
  }

  interface User extends DefaultUser {
    studentId?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    studentId?: string;
    phone?: string;
    name?: string;
  }
}