import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const categoryRouter = router({
  createCategory: protectedProcedure
    .input(z.object({ categoryName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.create({
          data: {
            categoryName: input.categoryName,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  getCategoryByName: publicProcedure
    .input(z.object({ categoryName: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUniqueOrThrow({
        where: {
          categoryName: input.categoryName,
        },
      });

      return category;
    }),
});
