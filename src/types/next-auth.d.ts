import type { DefaultUser } from "next-auth";
import { type DefaultSession } from "next-auth";
import type { ObjectValues } from "./util";

const ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  MOD: "MOD",
  GUEST: "GUEST",
} as const;

type Role = ObjectValues<typeof ROLE>;

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: Role;
  }
}
