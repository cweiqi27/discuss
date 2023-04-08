import { Menu } from "@headlessui/react";
import type { Role, Status } from "@prisma/client";
import {
  IconMessageDots,
  IconMessages,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import Avatar from "components/avatar/Avatar";
import CountIndicator from "components/CountIndicator";
import DeletePostComment from "components/DeletePostComment";
import DotsMenu from "components/DotsMenu";
import Vote from "components/Vote";
import { formatDistanceToNow, isEqual } from "date-fns";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import CommentCreate from "./CommentCreate";
import CommentEdit from "./CommentEdit";
import CommentListReplies from "./CommentListReplies";

type CommentCardProps = {
  comment: RouterOutputs["comment"]["getAllCursor"]["comments"][number];
  postStatus: Status;
  userId: string | undefined;
  userRole: Role | undefined;
};

const CommentCard = ({
  comment,
  postStatus,
  userId,
  userRole,
}: CommentCardProps) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyComment, setReplyComment] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  const { data: children } = trpc.comment.getChildrenCount.useQuery({
    parentId: comment.id,
  });

  const commentDate = useMemo(() => {
    return formatDistanceToNow(comment.createdAt) + " ago";
  }, [comment.createdAt]);
  const editedDate = useMemo(() => {
    const date = formatDistanceToNow(comment.updatedAt) + " ago";
    const isEdited = !isEqual(comment.createdAt, comment.updatedAt);
    return { date, isEdited };
  }, [comment.updatedAt, comment.createdAt]);

  const handleClickShowReplies = () => {
    setShowReplies(!showReplies);
  };
  return (
    <>
      {/* Comment Card */}
      <div className="group/card flex flex-col gap-4 p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              src={comment.user.image ?? ""}
              name={comment.user.name ?? ""}
              profileSlug={comment.userId}
            />
            <Link
              href={`/users/${comment.userId}`}
              className="flex gap-1 text-sm font-semibold text-zinc-300 hover:opacity-80"
            >
              {comment.user.name}
            </Link>
          </div>
          <div className="flex gap-1">
            <div className="group inline-flex gap-1">
              <span className="text-xs text-zinc-400">{commentDate}</span>
              {editedDate.isEdited && (
                <div className="inline-flex text-xs text-zinc-400 hover:underline">
                  {"(edited"}
                  <div className="hidden group-hover:block group-hover:underline">
                    : {editedDate.date}
                  </div>
                  {")"}
                </div>
              )}
            </div>
            {(comment.userId === userId ||
              userRole === "MOD" ||
              userRole === "ADMIN") && (
              <DotsMenu>
                <Menu.Item as="div">
                  {comment.userId === userId && (
                    <button
                      onClick={() => setEdit(!edit)}
                      className="flex w-full items-center justify-start gap-2 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                    >
                      <IconPencil />
                      <span className="text-sm">Edit</span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item as="div">
                  {(userRole === "MOD" ||
                    userRole === "ADMIN" ||
                    comment.userId === userId) && (
                    <>
                      <DeletePostComment
                        id={comment.id}
                        userId={comment.userId}
                        title={comment.content}
                        type="COMMENT"
                        role={userRole}
                        addStyles="gap-2 rounded justify-start px-2 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                      />
                    </>
                  )}
                </Menu.Item>
                <Menu.Item as="div">
                  {comment.userId !== userId && userRole === "USER" && (
                    <button
                      type="button"
                      className="flex w-full items-center justify-start gap-2 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                    >
                      <IconPencil />
                      <span className="text-sm">Report</span>
                    </button>
                  )}
                </Menu.Item>
              </DotsMenu>
            )}
          </div>
        </div>
        {/* Content */}
        <div className="max-w-lg self-start">
          {edit ? (
            <CommentEdit
              commentId={comment.id}
              userId={comment.userId}
              content={comment.content}
              edit={edit}
              setEdit={setEdit}
            />
          ) : (
            <span className="break-words px-3 py-1 text-justify text-zinc-200">
              {comment.content}
            </span>
          )}
        </div>
        {/* Bottom row */}
        <div className="flex gap-2">
          <Vote
            type="comment"
            postId={comment.id}
            commentPostId={comment.postId}
            isFlexRow
          />
          {/* Reply Comment Button */}
          <button
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
              replyComment
                ? "bg-violet-800 text-teal-300"
                : "text-zinc-400 hover:bg-violet-800 hover:text-teal-300"
            } transition`}
            onClick={() => setReplyComment(!replyComment)}
          >
            <IconMessageDots />
            <span className="text-xs">Reply</span>
          </button>
          {/* View Replies Button */}
          {children && children.childrenCount > 0 && !showReplies && (
            <>
              <button
                className="relative inline-flex justify-center rounded-full bg-zinc-700 p-2 py-1 text-zinc-300 transition hover:bg-zinc-600"
                onClick={handleClickShowReplies}
              >
                <IconMessages />
                <CountIndicator count={children.childrenCount} />
              </button>
            </>
          )}
        </div>
        {/* Reply comment */}
        {replyComment && (
          <CommentCreate
            postId={comment.post.id}
            parentId={comment.id}
            postStatus={postStatus}
          />
        )}
      </div>

      {/* Replies */}
      {showReplies && (
        <div className="group/show s flex w-full border-t-[0.1rem] border-b-[0.05rem] border-t-zinc-700/90 border-b-zinc-700">
          <button
            className="relative w-2 duration-75 before:absolute before:top-0 before:left-0 before:bottom-0
            before:w-[0.2rem] before:rounded-full before:bg-zinc-500 before:transition before:content-[''] 
            before:hover:bg-zinc-400"
            onClick={handleClickShowReplies}
          />
          <div className="flex-1 pl-2">
            <CommentListReplies
              postId={comment.postId}
              parentId={comment.id}
              postStatus={postStatus}
              userId={userId}
              userRole={userRole}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCard;
