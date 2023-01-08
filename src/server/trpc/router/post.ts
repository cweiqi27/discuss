import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = router({
  // Get all posts
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

  // Get single post
  getPost: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.post.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullish(),
        userId: z.string(),
        categoryId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            title: input.title,
            description: input.description,
            user: {
              connect: {
                id: input.userId,
              },
            },
            upvotes: {
              create: [
                {
                  user: {
                    connect: {
                      id: input.userId,
                    },
                  },
                },
              ],
            },
            category: {
              connect: {
                id: input.categoryId,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
