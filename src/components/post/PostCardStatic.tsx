import Avatar from "components/avatar/Avatar";
import { format, formatDistanceToNow, isEqual } from "date-fns";
import React, { useEffect, useMemo } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import { usePostEditStore } from "store/postStaticStore";
import PostEdit from "./PostEdit";
import PostFlairList from "./PostFlairList";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import Vote from "./Vote";
import CommentCreate from "components/comment/CommentCreate";
import RemovedMessage from "./RemovedMessage";
import Delete from "components/Delete";

type PostCardStaticProps = {
  post: RouterOutputs["post"]["getById"]["post"];
  category: string;
};

const PostCardStatic = ({ post, category }: PostCardStaticProps) => {
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
  const { data: userRole } = trpc.auth.getUserRole.useQuery();

  const postDate = useMemo(() => {
    if (post) return format(post.createdAt, "MMM d, yyyy p");
  }, [post]);
  const editedDate = useMemo(() => {
    if (post) return formatDistanceToNow(post.updatedAt);
  }, [post]);

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
              <div className="inline-flex gap-2">
                <span className="text-sm text-zinc-300">{postDate}</span>
                {!isEqual(post.createdAt, post.updatedAt) && (
                  <span className="text-sm text-zinc-400">
                    {post.status === "PRESENT" ? "(edited:" : "(removed:"}{" "}
                    {editedDate}
                    {")"}
                  </span>
                )}
              </div>
            </div>
          </div>
          {post.status !== "PRESENT" ? (
            <RemovedMessage postStatus={post.status} />
          ) : (
            <>
              {isEdit && userId && post.userId === userId ? (
                <PostEdit post={post} />
              ) : (
                <>
                  <PostFlairList postId={post.id} flexWrap />
                  <div className="flex max-w-[14rem] flex-col sm:max-w-none">
                    <h2 className="break-words text-3xl font-bold text-zinc-200">
                      {post.title}
                    </h2>
                    <p className="break-words text-zinc-200">
                      {post.description}
                    </p>
                  </div>
                </>
              )}
              {category === "discussion" && (
                <>
                  <div className="flex gap-2">
                    <Vote postId={post.id} type="post" isFlexRow />
                    {userId && post.userId === userId && (
                      <>
                        <button
                          className={`flex items-center justify-center gap-1 rounded-full px-3 py-1 transition
                          ${
                            isEdit
                              ? "bg-violet-800 text-teal-300"
                              : "text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                          }`}
                          onClick={handleClickEdit}
                          type="button"
                        >
                          <IconPencil />
                          Edit
                        </button>
                      </>
                    )}
                    {((userId && post.userId === userId) ||
                      userRole === "ADMIN" ||
                      userRole === "MOD") && (
                      <Delete
                        id={post.id}
                        userId={post.userId}
                        title={post.title}
                        type="POST"
                        role={userRole}
                        addStyles="rounded-full gap-2 rounded px-3 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                      />
                    )}
                  </div>
                  <CommentCreate postId={post.id} postStatus={post.status} />
                </>
              )}
            </>
          )}
        </div>
      </>
    )
  );
};

export default PostCardStatic;
