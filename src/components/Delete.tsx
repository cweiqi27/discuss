import { Dialog } from "@headlessui/react";
import type { Role } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { trpc } from "utils/trpc";

type DeleteProps = {
  id: string;
  userId: string;
  title: string;
  type: "POST" | "COMMENT";
  role: Role | undefined;
  addStyles?: string;
};

const Delete = ({ id, userId, title, type, role, addStyles }: DeleteProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const utils = trpc.useContext();
  const deletePost = trpc.post.delete.useMutation({
    onSuccess() {
      utils.post.getByCategoryCursor.invalidate();
      utils.post.getByUserIdCursor.invalidate();
      utils.post.getById.invalidate();
    },
  });
  const deleteComment = trpc.comment.delete.useMutation({
    onSuccess() {
      utils.comment.getAllCursor.invalidate();
      utils.comment.getByUserIdCursor.invalidate();
    },
  });

  const handleClickDelete = () => {
    if (type === "POST") {
      deletePost.mutate({
        postId: id,
        userId: userId,
        role: role,
      });
    } else {
      deleteComment.mutate({
        commentId: id,
        userId: userId,
        role: role,
      });
    }
  };
  return (
    <>
      <button
        className={`flex items-center justify-center transition ${addStyles}`}
        onClick={() => setShowModal(true)}
      >
        <IconTrash />
        Delete
      </button>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <div className="fixed inset-0 grid place-items-center bg-zinc-900/70 p-4 backdrop-blur">
          <Dialog.Panel className="flex w-full max-w-sm flex-col gap-4 rounded bg-gradient-to-br from-zinc-200/60 to-zinc-200/80 p-6">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="text-xl font-bold text-zinc-900">
                Delete
              </Dialog.Title>
              <Dialog.Description className="text-sm text-zinc-800">
                You are about to delete{" "}
                {type === "POST" ? "a post" : "a comment"}
                {"."}
              </Dialog.Description>
            </div>
            <p className="truncate">Are you sure you want to remove {title}?</p>
            <div className="flex gap-1">
              <button
                onClick={handleClickDelete}
                className="rounded-full bg-rose-500 px-3 py-1 text-zinc-300 transition hover:bg-rose-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-zinc-600 px-3 py-1 text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Delete;
