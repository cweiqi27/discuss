import { VoteType } from "@prisma/client";
import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  modProcedure,
} from "../trpc";

export const postRouter = router({
  /**
   * GET METHODS
   */
  getAllRaw: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (e) {
      console.log(e);
    }
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          flairs: {
            select: {
              flairId: true,
            },
          },
          user: true,
        },
      });
      return { post };
    }),

  getAllCursor: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        categoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          categoryId: input.categoryId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          user: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
          flairs: {
            select: {
              flairId: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];
        nextCursor = nextItem.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),

  getByUserIdCursor: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: input.userId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          user: true,
          flairs: true,
          comments: true,
          category: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];
        nextCursor = nextItem.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),

  getSticky: publicProcedure.query(async ({ ctx }) => {
    try {
      return ctx.prisma.post.findMany({
        where: {
          category: {
            categoryName: "sticky",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (e) {
      console.log(e);
    }
  }),

  getAllFlairs: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.flair.findMany();
    } catch (e) {
      console.log(e);
    }
  }),

  getFlairsByPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const flairs = await ctx.prisma.postFlair.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          flair: {
            select: {
              id: true,
              flairName: true,
            },
          },
        },
      });
      return { flairs };
    }),

  /**
   * POST METHODS
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().nullish(),
        categoryId: z.string(),
        flairIdArr: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const flairsObjects = input.flairIdArr?.map((flairId) => ({
        flairId: flairId,
      }));
      try {
        await ctx.prisma.post.create({
          data: {
            title: input.title,
            description: input.description,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            category: {
              connect: {
                id: input.categoryId,
              },
            },
            flairs: {
              createMany: {
                data: flairsObjects,
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  updateBySessionUser: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        userId: z.string(),
        title: z.string(),
        description: z.string(),
        flairIdArr: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId !== ctx.session.user.id) return;
      try {
        await ctx.prisma.postFlair.deleteMany({
          where: { postId: input.postId },
        });

        return await ctx.prisma.post.update({
          where: { id: input.postId },
          data: {
            title: input.title,
            description: input.description,
            flairs: {
              connectOrCreate: input.flairIdArr.map((flairId) => {
                return {
                  where: {
                    postId_flairId: { postId: input.postId, flairId: flairId },
                  },
                  create: { flairId: flairId },
                };
              }),
            },
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  deleteBySessionUser: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.userId === ctx.session.user.id)
          return ctx.prisma.post.delete({
            where: { id: input.postId },
          });
      } catch (e) {
        console.log(e);
      }
    }),
});
