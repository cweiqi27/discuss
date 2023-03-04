import type { Status } from "@prisma/client";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

type RemovedMessageProps = {
  postStatus: Status;
};

const RemovedMessage = ({ postStatus }: RemovedMessageProps) => {
  return (
    <>
      <div className="inline-flex gap-2">
        <IconAlertTriangleFilled className="text-rose-500" />
        {postStatus === "REMOVED_BY_USER" && (
          <span className="text-zinc-400">
            This post has been removed by the author.
          </span>
        )}
        {postStatus === "REMOVED_BY_MODERATOR" && (
          <span className="text-zinc-400">
            This post has been removed by the moderator.
          </span>
        )}
        {postStatus === "REMOVED_BY_ADMIN" && (
          <span className="text-zinc-400">
            This post has been removed by the admin.
          </span>
        )}
      </div>
    </>
  );
};

export default RemovedMessage;
