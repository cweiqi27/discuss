import { zodResolver } from "@hookform/resolvers/zod";
import { Status } from "@prisma/client";
import Textarea from "components/form/Textarea";
import LoadingBlur from "components/LoadingBlur";
import Spinner from "components/Spinner";
import Toast from "components/Toast";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import type { CreateCommentFormSchemaType } from "types/form";
import { CreateCommentFormSchema } from "types/form";
import { trpc } from "utils/trpc";

type CommentCreateProps = {
  parentId?: string;
  postId: string;
  postStatus: Status;
  callback?: () => void;
};

const CommentCreate = ({
  parentId,
  postId,
  postStatus,
  callback,
}: CommentCreateProps) => {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(CreateCommentFormSchema),
  });

  const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const createComment = trpc.comment.create.useMutation({
    onSuccess() {
      utils.comment.getAllCursor.invalidate();
      utils.comment.getChildrenCount.invalidate();
      reset();
    },
  });

  const onSubmit = () => {
    const content: CreateCommentFormSchemaType["content"] =
      getValues("content");

    createComment.mutate({
      postId: postId,
      content: content,
      status: postStatus,
      parentId: parentId ?? null,
    });
  };

  const content = watch("content");

  const handleClickTextarea = () => {
    if (!sessionData) signIn("google");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative" onClick={handleClickTextarea}>
          <Textarea
            name="content"
            register={register}
            placeholder={`${
              postStatus === "PRESENT"
                ? "Leave a comment 🤓"
                : "Comment disabled"
            }`}
            addStyles="w-full"
            disabled={postStatus !== "PRESENT"}
          />
          {createComment.isLoading && <LoadingBlur />}
        </div>
        <button
          disabled={!content || postStatus !== "PRESENT"}
          className={`${
            content
              ? "cursor-pointer bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
              : "cursor-not-allowed bg-zinc-700/60 text-zinc-500"
          } rounded-full px-3 py-1 transition`}
          type="submit"
        >
          {createComment.isLoading ? <Spinner /> : "Comment"}
        </button>
      </form>

      {createComment.isSuccess && (
        <Toast type="SUCCESS" message="Comment successfully created!" />
      )}

      {createComment.isError && (
        <Toast type="ERROR" message="Something went wrong!" />
      )}
    </>
  );
};

export default CommentCreate;
