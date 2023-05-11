import { addMonths, endOfMonth, startOfMonth, startOfYear } from "date-fns";
import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  modProcedure,
  adminProcedure,
} from "../trpc";

export const userRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: id,
        },
      });
    }),

  getAllOffset: publicProcedure
    .input(
      z.object({
        currentPage: z.number().default(1),
        take: z.number().default(10),
        orderBy: z.enum(["nameAsc", "nameDesc", "status", "role"]).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { currentPage, take, orderBy } = input;

      return await ctx.prisma.user.findMany({
        skip: currentPage * take,
        take: take,
        orderBy: {
          name:
            orderBy === "nameAsc"
              ? "asc"
              : orderBy === "nameDesc"
              ? "desc"
              : undefined,
          status: orderBy === "status" ? "asc" : undefined,
          role: orderBy === "role" ? "asc" : undefined,
        },
      });
    }),

  getProfileBio: publicProcedure
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
          profileBio: true,
        },
      });
    }),

  getCountByMonthlyFilterJoinedDate: modProcedure
    .input(
      z.object({
        monthsFromStartOfYearToNow: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { monthsFromStartOfYearToNow } = input;
      const userArr: number[] = [];
      let beforeDate = startOfYear(Date.now());

      for (let i = 0; i < monthsFromStartOfYearToNow; i++) {
        beforeDate =
          i === 0 ? endOfMonth(beforeDate) : addMonths(beforeDate, 1);
        await ctx.prisma.user
          .count({
            where: {
              createdAt: {
                lte: beforeDate,
                gte: startOfMonth(beforeDate),
              },
            },
          })
          .then((user) => {
            userArr.push(user);
          });
      }

      return userArr;
    }),

  getCountAllUsers: modProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count();
  }),

  getCountActiveUsers: modProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.count({ where: { status: "PRESENT" } });
  }),

  updateProfileBio: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, content } = input;

      return await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profileBio: content,
        },
      });
    }),

  updateWarning: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return await ctx.prisma.user.update({
        where: { id: id },
        data: {
          status: "WARNING",
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      if (id === ctx.session.user.id || ctx.session.user.role === "ADMIN") {
        return await ctx.prisma.user.update({
          where: { id: id },
          data: {
            status: "REMOVED",
          },
        });
      } else {
        return "Unauthorized";
      }
    }),
});
