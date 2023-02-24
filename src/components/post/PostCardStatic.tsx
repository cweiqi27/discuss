import Avatar from "components/avatar/Avatar";
import PillButton from "components/button/PillButton";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import { usePostEditStore } from "store/postStaticStore";
import PostEdit from "./PostEdit";
import PostFlairList from "./PostFlairList";
import { IconPencil } from "@tabler/icons-react";
import Vote from "./Vote";
import CommentCreate from "components/comment/CommentCreate";

type PostCardStaticProps = {
  post: RouterOutputs["post"]["getById"]["post"];
};

const PostCardStatic = ({ post }: PostCardStaticProps) => {
  /**
   * Zustand stores
   */
  const isEdit = usePostEditStore((state) => state.edit);
  const setEditTrue = usePostEditStore((state) => state.updateEditTrue);
  const setEditFalse = usePostEditStore((state) => state.updateEditFalse);
  const isEditing = usePostEditStore((state) => state.editing);

  useEffect(() => {
    return () => {
      if (isEditing) setEditFalse();
    };
  }, [setEditFalse, isEditing]);

  const { data: userId } = trpc.auth.getUserId.useQuery();

  const postDate = post && format(post.createdAt, "MMM d, yyyy p");

  const handleClickEdit = () => {
    isEdit ? setEditFalse() : setEditTrue();
  };

  return (
    post && (
      <>
        <div className="mx-2 flex min-w-0 flex-col gap-4 rounded border border-zinc-500 bg-zinc-600/20 p-4 shadow sm:mx-0">
          <div className="flex items-start gap-2">
            <Avatar
              size="md"
              src={post.user.image ?? ""}
              alt={post.user.name ?? ""}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-300">
                {post.user.name}
              </span>
              <span className="text-sm text-zinc-300">{postDate}</span>
            </div>
          </div>
          {isEdit && userId && post.userId === userId ? (
            <PostEdit post={post} />
          ) : (
            <>
              <PostFlairList postId={post.id} flexWrap />
              <div className="flex max-w-[14rem] flex-col sm:max-w-none">
                <h2 className="break-words text-3xl font-bold text-zinc-200">
                  {post.title}
                </h2>
                <p className="break-words text-zinc-200">{post.description}</p>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <Vote postId={post.id} type="post" isFlexRow />
            {userId && post.userId === userId && (
              <button
                className={`flex items-center justify-center gap-1 rounded-full px-3 py-1 transition
            ${
              isEdit
                ? "bg-violet-800 text-teal-300"
                : "bg-zinc-700 text-zinc-400 hover:bg-violet-800 hover:text-teal-300"
            }`}
                onClick={handleClickEdit}
                type="button"
              >
                <IconPencil />
                Edit
              </button>
            )}
          </div>
          <CommentCreate postId={post.id} />
        </div>
      </>
    )
  );
};

export default PostCardStatic;
