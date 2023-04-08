import { staffEmail, studentEmail } from "utils/general";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUserId: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.id;
  }),
  getUserName: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.name;
  }),
  getUserImg: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.image;
  }),
  getUserRole: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.role;
  }),
  assignRole: protectedProcedure
    .input(
      z.object({
        email: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { email } = input;
      const userEmail = email ?? ctx.session.user.email;
      const userEmailDomain = userEmail?.split("@")[1];
      try {
        if (userEmail === "chanweiqi27@gmail.com") {
          return await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              role: "ADMIN",
            },
          });
        }
        if (userEmailDomain === staffEmail) {
          return await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              role: "MOD",
            },
          });
        } else if (userEmailDomain === studentEmail) {
          return await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              role: "USER",
            },
          });
        } else {
          return await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              role: "GUEST",
            },
          });
        }
      } catch (e) {
        return e;
      }
    }),
});
