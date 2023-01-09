import { pusher } from "server/common/pusher";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const pusherRouter = router({
  trigger: publicProcedure.query(() => {
    pusher.trigger("my-channel", "my-event", {
      message: "pusher works",
    });
  }),
});
