import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import Textarea from "components/form/Textarea";
import LoadingBlur from "components/LoadingBlur";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { CreateCommentFormSchemaType } from "types/form";
import { CreateCommentFormSchema } from "types/form";
import { trpc } from "utils/trpc";

type CommentEditProps = {
  commentId: string;
  content: string;
  userId: string;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
};

const CommentEdit = ({
  commentId,
  content,
  userId,
  edit,
  setEdit,
}: CommentEditProps) => {
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(CreateCommentFormSchema),
  });

  const utils = trpc.useContext();
  const editComment = trpc.comment.updateBySessionUser.useMutation({
    onSuccess() {
      utils.comment.getAllCursor.invalidate();
      utils.comment.getByUserIdCursor.invalidate();
      setEdit(false);
    },
  });

  const onSubmit = () => {
    const content: CreateCommentFormSchemaType["content"] =
      getValues("content");

    if (!isDirty) {
      setEdit(false);
      return;
    } else {
      editComment.mutate({
        commentId: commentId,
        userId: userId,
        content: content,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative flex flex-col gap-2">
          <Textarea
            name="content"
            placeholder={content ? "" : "Comment something 🤓"}
            register={register}
            value={content ?? ""}
          />
          <ErrorMessage
            errors={errors}
            name="content"
            as="span"
            className="text-pink-400"
          />
          <div className="flex gap-2">
            <button
              className="rounded-full bg-teal-600 px-3 py-1 text-zinc-300 transition hover:bg-teal-500"
              type="submit"
            >
              Edit
            </button>
            <button
              className="rounded-full bg-zinc-600/40 px-3 py-1 text-zinc-300 transition hover:bg-zinc-600"
              type="button"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
          </div>
          {editComment.isLoading && <LoadingBlur />}
        </div>
      </form>
    </>
  );
};

export default CommentEdit;
