import { Role, Status } from "@prisma/client";
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

  getByCategoryCursor: publicProcedure
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
          status: "PRESENT",
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
        return await ctx.prisma.post
          .create({
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
            include: {
              user: true,
              flairs: {
                select: {
                  flair: {
                    select: {
                      flairName: true,
                    },
                  },
                },
              },
              category: true,
            },
          })
          .then(
            ({ id, title, description, user, createdAt, flairs, category }) => {
              ctx.algolia.saveObject({
                objectID: id,
                title: title,
                description: description,
                author: user.name,
                createdAt: createdAt,
                flairs: flairs.map((flair) => {
                  return flair.flair.flairName;
                }),
                category: category.categoryName,
                type: "Post",
              });
            }
          );
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

  delete: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
        role: z.nativeEnum(Role).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const status =
        input.role === "ADMIN"
          ? Status.REMOVED_BY_ADMIN
          : input.role === "MOD"
          ? Status.REMOVED_BY_MODERATOR
          : input.role === "USER"
          ? Status.REMOVED_BY_USER
          : null;
      try {
        if (!status && input.userId !== ctx.session.user.id) return;
        if (status) {
          return await ctx.prisma.post.update({
            where: { id: input.postId },
            data: {
              status: status,
              updatedAt: new Date(),
            },
          });
        }
        if (input.userId === ctx.session.user.id) {
          return await ctx.prisma.post.update({
            where: { id: input.postId },
            data: {
              status: "REMOVED_BY_USER",
              updatedAt: new Date(),
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
});
