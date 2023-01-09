import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  getUserId: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.id;
  }),
  getUserImg: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.image;
  }),
});
