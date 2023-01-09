import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { imageRouter } from "./image";
import { postRouter } from "./post";
import { pusherRouter } from "./pusher";

export const appRouter = router({
  auth: authRouter,
  pusher: pusherRouter,
  post: postRouter,
  category: categoryRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
