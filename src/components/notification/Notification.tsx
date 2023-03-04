import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";
import type { RouterOutputs } from "utils/trpc";
import Avatar from "../avatar/Avatar";

const MESSAGE_LOOKUP = {
  1: "liked your post: ",
  2: "commented on your post: ",
  3: "liked your comment on the post: ",
  4: "updated his comment on the post: ",
} as const;

type NotificationProps = {
  notification: RouterOutputs["notification"]["getAllCursor"]["notifications"][number];
};

const Notification = ({ notification }: NotificationProps) => {
  const notificationInitiatorName =
    notification.notificationObject.notificationInitiate.user.name ?? "";
  const notificationInitiatorImage =
    notification.notificationObject.notificationInitiate.user.image ?? "";
  const notificationTypeId = notification.notificationObject.notificationTypeId;
  let message = "";
  switch (notificationTypeId) {
    case 1:
      message = " liked your post: ";
      break;
    case 2:
      message = " commented on your post: ";
      break;
    case 3:
      message = " liked your comment on the post: ";
      break;
    case 4:
      message = " updated his comment on the post: ";
      break;
    default:
      break;
  }
  const notificationDate = useMemo(() => {
    return (
      formatDistanceToNowStrict(notification.notificationObject.createdAt) +
      " ago"
    );
  }, [notification.notificationObject.createdAt]);

  return (
    <Link
      href={`/posts/${notification.notificationObject.post.id}`}
      className="flex items-center gap-4 rounded-sm px-2 py-4 hover:bg-zinc-700 sm:text-lg"
    >
      <div className="shrink-0">
        <Avatar
          size="md"
          src={notificationInitiatorImage}
          alt={notificationInitiatorName}
        />
      </div>
      <div className="flex flex-col gap-2 overflow-auto">
        <p className="truncate text-sm leading-snug text-zinc-300">
          {notificationInitiatorName}
          {message}
          {notification.notificationObject.post.title ?? ""}
        </p>
        <span className="text-xs text-zinc-400">{notificationDate}</span>
      </div>
    </Link>
  );
};

export default Notification;
