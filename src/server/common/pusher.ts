import { env as serverEnv } from "env/server.mjs";
import { env as clientEnv } from "env/client.mjs";
import PusherServer from "pusher";

export const pusher = new PusherServer({
  appId: clientEnv.NEXT_PUBLIC_PUSHER_APP_ID,
  key: clientEnv.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: serverEnv.PUSHER_APP_SECRET,
  cluster: clientEnv.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  useTLS: true,
});
