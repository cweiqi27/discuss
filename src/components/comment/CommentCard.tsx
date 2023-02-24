import { IconMessageDots, IconMessages } from "@tabler/icons-react";
import Avatar from "components/avatar/Avatar";
import CountIndicator from "components/CountIndicator";
import Vote from "components/post/Vote";
import { formatDistanceToNowStrict, isEqual } from "date-fns";
import React, { useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import CommentCreate from "./CommentCreate";
import CommentListReplies from "./CommentListReplies";

type CommentCardProps = {
  comment: RouterOutputs["comment"]["getAllCursor"]["comments"][number];
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyComment, setReplyComment] = useState<boolean>(false);

  const { data: children } = trpc.comment.getChildrenCount.useQuery({
    parentId: comment.id,
  });

  const commentDate = formatDistanceToNowStrict(comment.createdAt) + " ago";
  const editedDate = formatDistanceToNowStrict(comment.updatedAt) + " ago";

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
              alt={comment.user.name ?? ""}
            />
            <span className="flex gap-1 text-sm font-semibold text-zinc-300">
              {comment.user.name}
            </span>
          </div>
          {!isEqual(comment.createdAt, comment.updatedAt) && (
            <>
              <span className="group inline-flex hover:underline">
                (edited : {editedDate})
              </span>
            </>
          )}
          <span className="text-xs text-zinc-400">{commentDate}</span>
        </div>
        {/* Content */}
        <div className="max-w-lg self-start">
          <span className="break-words px-3 py-1 text-justify text-zinc-200">
            {comment.content}
          </span>
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
          <CommentCreate postId={comment.postId} parentId={comment.id} />
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
            <CommentListReplies postId={comment.postId} parentId={comment.id} />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCard;
