import { Prisma } from "@prisma/client";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const categoryRouter = router({
  createRouter: publicProcedure
    .input(z.object({ categoryName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.create({
          data: {
            categoryName: input.categoryName,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            console.log(
              "There is a unique constraint violation, a new user cannot be created with this email"
            );
          }
        }
      }
    }),
});
