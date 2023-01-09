import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "server/common/pusher";

export default function pusherUserAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { socket_id } = req.body;
  const { user_id } = req.headers;

  if (!user_id || typeof user_id !== "string") {
    res.status(404).send("lol");
    return;
  }
  const authResponse = pusher.authenticateUser(socket_id, {
    id: user_id,
    name: "me",
  });
  res.send(authResponse);
}
