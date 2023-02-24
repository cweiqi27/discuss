import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        parentId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          userId: ctx.session.user.id,
          parentId: input.parentId,
        },
      });
    }),

  getAllCursor: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        postId: z.string(),
        sortBy: z.enum(["timeDesc", "timeAsc", "votes"]),
        parentId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, sortBy, postId, parentId } = input;

      const comments = await ctx.prisma.comment.findMany({
        take: limit + 1,
        orderBy:
          sortBy === "timeDesc"
            ? { createdAt: "desc" }
            : sortBy === "timeAsc"
            ? { createdAt: "asc" }
            : { votes: { _count: "desc" } },
        where: {
          postId: postId,
          parentId: parentId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop() as (typeof comments)[number];
        nextCursor = nextItem.id;
      }
      return {
        comments,
        nextCursor,
      };
    }),

  getByUserIdCursor: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        userId: z.string(),
        sortBy: z.enum(["timeDesc", "timeAsc", "votes"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, sortBy, userId } = input;

      const comments = await ctx.prisma.comment.findMany({
        take: limit + 1,
        orderBy:
          sortBy === "timeDesc"
            ? { createdAt: "desc" }
            : sortBy === "timeAsc"
            ? { createdAt: "asc" }
            : { votes: { _count: "desc" } },
        where: {
          userId: userId,
        },
        include: {
          post: true,
          user: true,
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (comments.length > limit) {
        const nextItem = comments.pop() as (typeof comments)[number];
        nextCursor = nextItem.id;
      }
      return {
        comments,
        nextCursor,
      };
    }),

  getPostCommentCount: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postId } = input;

      const commentCount = await ctx.prisma.comment.count({
        where: {
          postId: postId,
        },
      });

      return commentCount;
    }),

  getChildrenCount: publicProcedure
    .input(
      z.object({
        parentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { parentId } = input;

      const childrenCount = await ctx.prisma.comment.count({
        where: {
          parentId: parentId,
        },
      });

      return { childrenCount };
    }),
});
