import { staffEmail, studentEmail } from "utils/general";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    }),

  getProfileBio: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          profileBio: true,
        },
      });
    }),

  createOrEditProfileBio: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, content } = input;

      return await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profileBio: content,
        },
      });
    }),
});
