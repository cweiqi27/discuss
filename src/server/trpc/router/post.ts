import { Role, Status } from "@prisma/client";
import { addMonths, endOfMonth, startOfMonth, startOfYear } from "date-fns";
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

  getCountAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.count();
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
      const { limit, cursor, categoryId } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          categoryId: categoryId,
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

  getAllByCursorSortComments: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        isMonth: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, isMonth } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
        where: {
          status: "PRESENT",
          createdAt: { gte: isMonth ? startOfMonth(Date.now()) : undefined },
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
          comments: true,
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

  getByFlairCursor: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        flairId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, flairId } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          flairs: {
            some: {
              flairId: flairId,
            },
          },
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
        deleted: z.boolean().default(false),
        orderBy: z
          .enum([
            "createdAtDesc",
            "createdAtAsc",
            "commentsAsc",
            "commentsDesc",
            "votesAsc",
            "votesDesc",
          ])
          .default("createdAtDesc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, deleted, orderBy } = input;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        orderBy: [
          {
            createdAt:
              orderBy === "createdAtDesc"
                ? "desc"
                : orderBy === "createdAtAsc"
                ? "asc"
                : undefined,
            comments:
              orderBy === "commentsAsc" || orderBy === "commentsDesc"
                ? {
                    _count: orderBy === "commentsAsc" ? "asc" : "desc",
                  }
                : undefined,
            votes:
              orderBy === "votesAsc" || orderBy === "votesDesc"
                ? {
                    _count: orderBy === "votesAsc" ? "asc" : "desc",
                  }
                : undefined,
          },
        ],
        where: {
          userId: input.userId,
          status: deleted ? undefined : "PRESENT",
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

  getCountByUserMonthly: publicProcedure
    .input(
      z.object({
        id: z.string(),
        monthsFromStartOfYearToNow: z.number(),
        isAccumulate: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, monthsFromStartOfYearToNow, isAccumulate } = input;
      const postArr: number[] = [];
      let beforeDate = startOfYear(Date.now());
      for (let i = 0; i < monthsFromStartOfYearToNow; i++) {
        beforeDate =
          i === 0 ? endOfMonth(beforeDate) : addMonths(beforeDate, 1);
        await ctx.prisma.post
          .count({
            where: {
              userId: id,
              createdAt: {
                lte: beforeDate,
                gte: isAccumulate ? undefined : startOfMonth(beforeDate),
              },
            },
          })
          .then((post) => {
            postArr.push(post);
          })
          .catch((e) => console.log(e));
      }
      return postArr;
    }),

  getAllCountFilterFlair: publicProcedure.query(async ({ ctx }) => {
    const flairPostArr: {
      flairId: string | null;
      flairName: string;
      postCount: number;
    }[] = [];

    await ctx.prisma.flair.findMany().then((flairs) => {
      flairs.map(async (flair) => {
        await ctx.prisma.post
          .count({
            where: {
              flairs: {
                some: {
                  flairId: flair.id,
                },
              },
            },
          })
          .then((postCount) => {
            flairPostArr.push({
              flairId: flair.id,
              flairName: flair.flairName,
              postCount: postCount,
            });
          });
      });
    });

    await ctx.prisma.post
      .count({
        where: {
          flairs: undefined,
        },
      })
      .then((postCount) => {
        flairPostArr.push({
          flairId: null,
          flairName: "Without flair",
          postCount: postCount,
        });
      });

    return flairPostArr;
  }),

  getAllCountByUserFilterFlair: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const flairPostArr: {
        flairId: string | null;
        flairName: string;
        postCount: number;
      }[] = [];

      await ctx.prisma.flair.findMany().then((flairs) => {
        flairs.map(async (flair) => {
          await ctx.prisma.post
            .count({
              where: {
                userId: id,
                flairs: {
                  some: {
                    flairId: flair.id,
                  },
                },
              },
            })
            .then((postCount) => {
              flairPostArr.push({
                flairId: flair.id,
                flairName: flair.flairName,
                postCount: postCount,
              });
            });
        });
      });

      await ctx.prisma.post
        .count({
          where: {
            userId: id,
            flairs: undefined,
          },
        })
        .then((postCount) => {
          flairPostArr.push({
            flairId: null,
            flairName: "Without flair",
            postCount: postCount,
          });
        });

      return flairPostArr;
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

  getFlairById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.flair.findUnique({ where: { id: id } });
    }),

  getFlairIdByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name } = input;
      return await ctx.prisma.flair.findFirstOrThrow({
        where: { flairName: name },
      });
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
        console.error(e);
      }
    }),

  updateBySessionUser: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        userId: z.string().min(1),
        title: z.string(),
        description: z.string(),
        flairIdArr: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, userId, title, description, flairIdArr } = input;

      if (userId !== ctx.session.user.id) return;
      try {
        await ctx.prisma.postFlair.deleteMany({
          where: { postId: postId },
        });

        return await ctx.prisma.post.update({
          where: { id: postId },
          data: {
            title: title,
            description: description,
            flairs: {
              connectOrCreate: flairIdArr.map((flairId) => {
                return {
                  where: {
                    postId_flairId: { postId: postId, flairId: flairId },
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
          return await ctx.prisma.post
            .update({
              where: { id: input.postId },
              data: {
                status: status,
                updatedAt: new Date(),
              },
            })
            .then(() => {
              ctx.algolia.deleteObject(input.postId);
            });
        }
        if (input.userId === ctx.session.user.id) {
          return await ctx.prisma.post
            .update({
              where: { id: input.postId },
              data: {
                status: "REMOVED_BY_USER",
                updatedAt: new Date(),
              },
            })
            .then(() => {
              ctx.algolia.deleteObject(input.postId);
            });
        }
      } catch (e) {
        console.log(e);
      }
    }),
});
