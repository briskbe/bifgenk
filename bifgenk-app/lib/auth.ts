import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

function vercelUrl(host: string | undefined) {
  return host ? `https://${host}` : undefined;
}

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_ENV === "production"
    ? vercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    : vercelUrl(process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL)) ??
  "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [
    vercelUrl(process.env.VERCEL_URL),
    vercelUrl(process.env.VERCEL_BRANCH_URL),
    vercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  ].filter((origin): origin is string => Boolean(origin)),
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    password: {
      hash: hashPassword,
      // Members imported from Supabase keep their bcrypt hashes ("$2a$...")
      // so they can sign in with their existing passwords.
      verify: ({ hash, password }) =>
        hash.startsWith("$2") ? bcrypt.compare(password, hash) : verifyPassword({ hash, password }),
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      bannedUserMessage: "Hesabın askıya alındı. Bir yanlışlık olduğunu düşünüyorsan bizimle iletişime geç.",
    }),
    // Must be last so cookies set by server actions are forwarded to the browser.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
