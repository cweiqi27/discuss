// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  // OAuth
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  // Pusher
  PUSHER_APP_ID: z.string(),
  PUSHER_APP_SECRET: z.string(),
  PUSHER_APP_CLUSTER: z.string(),
  // Algolia
  ALGOLIA_ADMIN_KEY: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  NEXT_PUBLIC_ALGOLIA_API_ID: z.string(),
  NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY: z.string(),
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME: z.string(),
  NEXT_PUBLIC_STAFF_EMAIL_DOMAIN: z.string(),
  NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  NEXT_PUBLIC_ALGOLIA_API_ID: process.env.NEXT_PUBLIC_ALGOLIA_API_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY:
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_STAFF_EMAIL_DOMAIN: process.env.NEXT_PUBLIC_STAFF_EMAIL_DOMAIN,
  NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN:
    process.env.NEXT_PUBLIC_STUDENT_EMAIL_DOMAIN,
};
