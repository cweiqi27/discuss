import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const categoryRouter = router({
  createCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.create({
          data: {
            categoryName: input.name,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return category;
    }),

  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUniqueOrThrow({
        where: {
          categoryName: input.name,
        },
      });

      return category;
    }),
});
