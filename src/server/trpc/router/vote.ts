import { VoteType } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const voteRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["post", "comment"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const upvotes =
        input.type === "post"
          ? await ctx.prisma.postVote.count({
              where: {
                postId: input.id,
                voteType: "UPVOTE",
              },
            })
          : await ctx.prisma.commentVote.count({
              where: {
                commentId: input.id,
                voteType: "UPVOTE",
              },
            });

      const downvotes =
        input.type === "post"
          ? await ctx.prisma.postVote.count({
              where: {
                postId: input.id,
                voteType: "DOWNVOTE",
              },
            })
          : await ctx.prisma.commentVote.count({
              where: {
                commentId: input.id,
                voteType: "DOWNVOTE",
              },
            });

      return {
        upvotes,
        downvotes,
        voteCount: upvotes - downvotes,
      };
    }),

  getBySessionUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["post", "comment"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const postVoteData = {
        postId: input.id,
        userId: ctx.session.user.id,
      };

      const commentVoteData = {
        commentId: input.id,
        userId: ctx.session.user.id,
      };

      return input.type === "post"
        ? await ctx.prisma.postVote.findUnique({
            where: {
              postId_userId: postVoteData,
            },
            select: {
              voteType: true,
            },
          })
        : await ctx.prisma.commentVote.findUnique({
            where: {
              commentId_userId: commentVoteData,
            },
            select: {
              voteType: true,
            },
          });
    }),

  getByUserIdOffset: publicProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().min(1).default(10),
        userId: z.string(),
        type: z.enum(["post", "comment"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, type, userId } = input;
      const votes =
        type === "post"
          ? await ctx.prisma.postVote.findMany({
              skip: skip,
              take: take,
              where: {
                userId: userId,
              },
              orderBy: {
                createdAt: "desc",
              },
            })
          : await ctx.prisma.commentVote.findMany({
              skip: skip,
              take: take,
              where: {
                userId: userId,
              },
              orderBy: {
                createdAt: "desc",
              },
            });

      return { votes };
    }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        voteType: z.nativeEnum(VoteType),
        type: z.enum(["post", "comment"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return input.type === "post"
          ? await ctx.prisma.postVote.create({
              data: {
                postId: input.id,
                userId: ctx.session.user.id,
                voteType: input.voteType,
              },
            })
          : await ctx.prisma.commentVote.create({
              data: {
                commentId: input.id,
                userId: ctx.session.user.id,
                voteType: input.voteType,
              },
            });
      } catch (e) {
        console.log(e);
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        voteType: z.nativeEnum(VoteType),
        updateActionType: z.enum(["removeVote", "changeVote"]),
        type: z.enum(["post", "comment"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const postVoteData = {
        postId: input.id,
        userId: ctx.session.user.id,
      };

      const commentVoteData = {
        commentId: input.id,
        userId: ctx.session.user.id,
      };

      try {
        if (input.updateActionType === "removeVote") {
          return input.type === "post"
            ? await ctx.prisma.postVote.delete({
                where: {
                  postId_userId: postVoteData,
                },
              })
            : await ctx.prisma.commentVote.delete({
                where: {
                  commentId_userId: commentVoteData,
                },
              });
        } else if (input.updateActionType === "changeVote") {
          if (input.type === "post") {
            await ctx.prisma.postVote.delete({
              where: {
                postId_userId: postVoteData,
              },
            });
            return await ctx.prisma.postVote.create({
              data: {
                postId: input.id,
                userId: ctx.session.user.id,
                voteType: input.voteType,
              },
            });
          } else {
            await ctx.prisma.commentVote.delete({
              where: {
                commentId_userId: commentVoteData,
              },
            });
            return await ctx.prisma.commentVote.create({
              data: {
                commentId: input.id,
                userId: ctx.session.user.id,
                voteType: input.voteType,
              },
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    }),
});
