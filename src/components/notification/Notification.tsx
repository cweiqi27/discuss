import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React from "react";
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
  isLoading?: boolean;
};

const Notification = ({ notification, isLoading }: NotificationProps) => {
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
  const postLink = "/posts/" + notification.notificationObject.post.id;
  const notificationDate =
    formatDistanceToNowStrict(notification.notificationObject.createdAt) +
    " ago";

  return (
    <Link
      href={postLink}
      className="flex items-center gap-4 rounded-sm px-2 py-4 hover:bg-zinc-700 sm:text-lg"
    >
      <div className="shrink-0">
        <Avatar
          size="md"
          src={notificationInitiatorImage}
          alt={notificationInitiatorName}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm leading-snug text-zinc-300">
          {notificationInitiatorName}
          {message}
          {notification.notificationObject.post.title ?? ""}
        </span>
        <span className="text-xs text-zinc-400">{notificationDate}</span>
      </div>
    </Link>
  );
};

export default Notification;
