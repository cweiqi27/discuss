import { router } from "../trpc";
import { algoliaRouter } from "./algolia";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { commentRouter } from "./comment";
import { imageRouter } from "./image";
import { notificationRouter } from "./notification";
import { postRouter } from "./post";
import { pusherRouter } from "./pusher";
import { seedRouter } from "./seed";
import { userRouter } from "./user";
import { voteRouter } from "./vote";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  pusher: pusherRouter,
  post: postRouter,
  comment: commentRouter,
  category: categoryRouter,
  image: imageRouter,
  algolia: algoliaRouter,
  notification: notificationRouter,
  vote: voteRouter,
  seed: seedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
