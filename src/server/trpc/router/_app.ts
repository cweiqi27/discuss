import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { exampleRouter } from "./example";
import { postRouter } from "./post";
import { pusherRouter } from "./pusher";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  pusher: pusherRouter,
  post: postRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
