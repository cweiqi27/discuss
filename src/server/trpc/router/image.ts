import { getPlaiceholder } from "plaiceholder";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const imageRouter = router({
  blurImage: publicProcedure
    .input(
      z.object({
        src: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { base64 } = await getPlaiceholder(input.src);
      return base64;
    }),
});
