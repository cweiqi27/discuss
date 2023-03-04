import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const notificationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        commentId: z.string().nullish(),
        notificationTypeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, notificationTypeId, commentId } = input;
      const receiverObjects: {
        userId: string;
      }[] = [];

      await ctx.prisma.post
        .findFirst({
          where: {
            id: id,
          },
          select: {
            user: true,
          },
        })
        .then(
          (receiver) =>
            receiver && receiverObjects.push({ userId: receiver?.user.id })
        );

      commentId &&
        (await ctx.prisma.comment
          .findFirst({
            where: {
              id: commentId,
            },
            select: {
              user: true,
            },
          })
          .then((receiver) => {
            if (receiver && receiver.user.id !== ctx.session.user.id) {
              receiverObjects.push({ userId: receiver?.user.id });
            }
          }));

      try {
        if (
          !(await ctx.prisma.notificationInitiate.findFirst({
            where: {
              userId: ctx.session.user.id,
              notificationObject: {
                postId: id,
                notificationTypeId: notificationTypeId,
              },
            },
          }))
        ) {
          return await ctx.prisma.notificationInitiate
            .create({
              data: {
                userId: ctx.session.user.id,
                notificationObject: {
                  create: {
                    notificationsReceive: {
                      createMany: {
                        data: receiverObjects,
                      },
                    },
                    notificationTypeId: notificationTypeId,
                    postId: id,
                  },
                },
              },
              include: {
                notificationObject: {
                  include: {
                    notificationsReceive: {
                      select: {
                        userId: true,
                      },
                    },
                  },
                },
              },
            })

            .then((notification) => {
              notification.notificationObject?.notificationsReceive.map(
                async (notificationReceive) => {
                  await ctx.prisma.user.update({
                    where: {
                      id: notificationReceive.userId,
                    },
                    data: {
                      newNotificationCount: {
                        increment: 1,
                      },
                    },
                  });

                  const notificationChannel =
                    "user-" + notificationReceive.userId;
                  ctx.pusher.trigger(notificationChannel, "send-notification", {
                    message: "Invalidate notifications.",
                  });
                }
              );
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

  getNotificationCount: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          newNotificationCount: true,
        },
      });
    }),

  updateNotificationCount: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        count: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, count } = input;
      return await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          newNotificationCount: count,
        },
      });
    }),
});
