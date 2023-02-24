import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const notificationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notificationTypeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const receivers = await ctx.prisma.post.findMany({
        where: {
          id: input.id,
        },
        select: {
          user: true,
        },
      });

      const receiverObjects: {
        userId: string;
      }[] = receivers.map((receiver) => ({
        userId: receiver.user.id,
      }));

      try {
        if (
          !(await ctx.prisma.notificationInitiate.findFirst({
            where: {
              userId: ctx.session.user.id,
              notificationObject: {
                postId: input.id,
                notificationTypeId: input.notificationTypeId,
              },
            },
          }))
        ) {
          return await ctx.prisma.notificationInitiate.create({
            data: {
              userId: ctx.session.user.id,
              notificationObject: {
                create: {
                  notificationsReceive: {
                    createMany: {
                      data: receiverObjects,
                    },
                  },
                  notificationTypeId: input.notificationTypeId,
                  postId: input.id,
                },
              },
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),

  getAllCursor: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const notifications = await ctx.prisma.notificationReceive.findMany({
        take: limit + 1,
        orderBy: {
          notificationObject: {
            createdAt: "desc",
          },
        },
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          notificationObject: {
            select: {
              notificationTypeId: true,
              notificationInitiate: {
                select: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
              post: {
                select: {
                  id: true,
                  title: true,
                },
              },
              createdAt: true,
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (notifications.length > limit) {
        const nextItem = notifications.pop() as (typeof notifications)[number];
        nextCursor = nextItem.id;
      }
      return {
        notifications,
        nextCursor,
      };
    }),
});
