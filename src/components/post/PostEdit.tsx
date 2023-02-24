import { Listbox, Transition } from "@headlessui/react";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCheck, IconTag } from "@tabler/icons-react";
import PillButton from "components/button/PillButton";
import Input from "components/form/Input";
import Textarea from "components/form/Textarea";
import LoadingBlur from "components/LoadingBlur";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMeasure from "react-use-measure";
import { usePostEditStore } from "store/postStaticStore";
import { EditPostFormSchema } from "types/form";
import { useEffectOnce } from "usehooks-ts";
import { editVariants } from "utils/framer";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";

type PostEditProps = {
  post: RouterOutputs["post"]["getById"]["post"];
};

const PostEdit = ({ post }: PostEditProps) => {
  /**
   * Zustand stores
   */
  const isEdit = usePostEditStore((state) => state.edit);
  const setEditFalse = usePostEditStore((state) => state.updateEditFalse);
  const isEditing = usePostEditStore((state) => state.editing);
  const setEditingTrue = usePostEditStore((state) => state.updateEditingTrue);
  const setEditingFalse = usePostEditStore((state) => state.updateEditingFalse);

  const { data: flairs } = trpc.post.getAllFlairs.useQuery();
  const [selectedFlair, setSelectedFlair] = useState<string[]>([]);
  let originalSelectedFlairArr: string[] | null = [];

  useEffectOnce(() => {
    if (post) {
      originalSelectedFlairArr = post.flairs.map((flair) => flair.flairId);
      setSelectedFlair(originalSelectedFlairArr);
    }
  });

  useEffect(() => {
    setEditingTrue();

    return () => {
      setEditingFalse();
    };
  }, [setEditFalse, isEditing, setEditingTrue, setEditingFalse]);

  const utils = trpc.useContext();
  const updatePost = trpc.post.updateBySessionUser.useMutation({
    onSuccess() {
      utils.post.getById.invalidate();
      setEditFalse();
    },
  });
  const { data: userId } = trpc.auth.getUserId.useQuery();

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(EditPostFormSchema),
  });

  const handleClickCancel = () => {
    reset();
    setEditFalse();
  };

  const onSubmit = async () => {
    const title: EditPostFormSchema["title"] = getValues("title");
    const description: EditPostFormSchema["description"] =
      getValues("description");

    if (!isDirty && selectedFlair === originalSelectedFlairArr) {
      setEditFalse();
    } else {
      if (post) {
        updatePost.mutate({
          postId: post.id,
          userId: userId ?? "",
          title: title ?? "",
          description: description ?? "",
          flairIdArr: selectedFlair,
        });
        reset();
      }
    }

    setSelectedFlair([]);
  };

  const [measureRef, { height }] = useMeasure();

  return (
    post && (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            animate={{ height }}
            transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          >
            {isEdit && (
              <motion.div
                ref={measureRef}
                variants={editVariants}
                initial="enter"
                animate="visible"
                exit="exit"
                className="relative flex min-w-0 flex-col gap-4 rounded bg-zinc-600/20 p-4 shadow shadow-zinc-600"
              >
                {/* Title field */}
                <Input
                  type="text"
                  name="title"
                  label="Title"
                  register={register}
                  addStyles="col-start-2 col-end-11 outline-teal-500"
                  value={post.title}
                />
                <div className="cold-end-13 col-start-11" />
                <ErrorMessage
                  errors={errors}
                  name="title"
                  as="span"
                  className="col-start-2 col-end-11 text-pink-400"
                />

                {/* Description field */}
                <Textarea
                  name="description"
                  label="Description"
                  placeholder={
                    post.description
                      ? ""
                      : "(Optional) Something that describes the nature of the post."
                  }
                  register={register}
                  addStyles="h-32 outline-teal-500"
                  value={post.description ?? ""}
                />

                {/* Flairs */}
                <Listbox
                  value={selectedFlair}
                  onChange={setSelectedFlair}
                  multiple
                >
                  <div className="relative flex min-w-0 flex-col items-start">
                    <div className="flex gap-2">
                      <Listbox.Button className="group flex items-center gap-2 ui-disabled:cursor-not-allowed">
                        <span className="hover: rounded-full bg-zinc-50/10 p-1 text-zinc-300 transition hover:bg-zinc-50/20 ui-open:bg-violet-400/20 ui-open:text-teal-500">
                          <IconTag />
                        </span>
                        {flairs && selectedFlair && selectedFlair.length > 0 ? (
                          <span
                            className="flex cursor-pointer items-center rounded-full px-3 text-zinc-200
                                      transition odd:bg-pink-400/20 even:bg-violet-400/20 hover:odd:bg-pink-400/30 hover:even:bg-violet-400/30"
                          >
                            {selectedFlair.length} flair(s) selected.
                          </span>
                        ) : (
                          <>
                            <span className="hidden text-sm text-zinc-300 transition ui-open:block">
                              Select flairs to help others understand what kind
                              of post this is.
                            </span>
                            <span className="text-zinc-400 group-hover:text-zinc-200 ui-open:hidden">
                              Flair
                            </span>
                          </>
                        )}
                      </Listbox.Button>
                    </div>

                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Listbox.Options className="z-30 mt-1 max-h-48 overflow-y-auto rounded-lg bg-zinc-700">
                        {flairs &&
                          flairs.map((flair) => (
                            <Listbox.Option
                              key={flair.id}
                              value={flair.id}
                              className="flex shrink-0 cursor-pointer justify-between gap-2 px-4 py-2 hover:bg-zinc-600
                                    ui-selected:text-green-500 ui-not-selected:text-zinc-200
                                  "
                            >
                              {flair.flairName}
                              <IconCheck
                                className={`${
                                  selectedFlair?.includes(flair.id)
                                    ? "visible"
                                    : "invisible"
                                }`}
                              />
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>

                {/* Submit */}
                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-tertiary btn-md rounded-full"
                  >
                    Edit
                  </button>
                  <PillButton
                    handleClick={handleClickCancel}
                    colorType="btn-primary"
                    size="btn-md"
                    type="button"
                  >
                    Cancel
                  </PillButton>
                </div>

                {/* Loading spinner and overlay */}
                {updatePost.isLoading && <LoadingBlur />}
              </motion.div>
            )}
          </motion.div>
        </form>
      </>
    )
  );
};

export default PostEdit;
