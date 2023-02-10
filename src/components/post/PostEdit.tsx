import { Listbox, Transition } from "@headlessui/react";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCheck, IconTag } from "@tabler/icons";
import PillButton from "components/button/PillButton";
import Input from "components/form/Input";
import Textarea from "components/form/Textarea";
import React from "react";
import { useForm } from "react-hook-form";
import { EditPostFormSchema } from "types/form";
import type { RouterOutputs } from "utils/trpc";

type PostEditProps = {
  post: RouterOutputs["post"]["getPost"]["post"];
};

const PostEdit = (props: PostEditProps) => {
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(EditPostFormSchema),
  });

  const onSubmit = async () => {
    const title: EditPostFormSchema["title"] = getValues("title");
    const description: EditPostFormSchema["description"] =
      getValues("description");

    reset();
  };

  return (
    <>
      <section className="sticky mb-2">
        <div>
          <div className="grid grid-flow-row gap-2 rounded p-4">
            <div className="relative grid grid-flow-row">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative grid grid-flow-row">
                  {/* Bottom part */}
                  <div className="flex flex-col gap-4 rounded bg-zinc-600/20 p-4 shadow shadow-purple-500">
                    {/* Title field */}
                    <Input
                      type="text"
                      name="title"
                      label="Title"
                      register={register}
                      placeholder="A catchy title!"
                      addStyles="col-start-2 col-end-11 outline-teal-500"
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
                      placeholder={props.post.description ?? "Description"}
                      label="Description"
                      register={register}
                      addStyles="h-32 outline-teal-500"
                    />

                    {/* Flairs */}
                    <Listbox
                      value={selectedFlair}
                      onChange={setSelectedFlair}
                      multiple
                      horizontal
                      disabled={sticky}
                    >
                      <div className="relative flex flex-col items-start">
                        <div className="flex gap-2">
                          <Listbox.Button className="group flex items-center gap-2 ui-disabled:cursor-not-allowed">
                            <span className="hover: rounded-full bg-zinc-50/10 p-1 text-zinc-300 transition hover:bg-zinc-50/20 ui-open:bg-violet-400/20 ui-open:text-teal-500">
                              <IconTag />
                            </span>
                            {flairs &&
                            selectedFlair &&
                            selectedFlair.length > 0 ? (
                              selectedFlair.map((flairId) => {
                                return (
                                  <span
                                    className="flex cursor-pointer items-center rounded-full px-3 text-zinc-200
                                      transition odd:bg-pink-400/20 even:bg-violet-400/20 hover:odd:bg-pink-400/30 hover:even:bg-violet-400/30"
                                    key={flairs[flairId - 1]?.id}
                                  >
                                    {flairs[flairId - 1]?.flairName}
                                  </span>
                                );
                              })
                            ) : (
                              <>
                                <span className="hidden text-sm text-zinc-300 transition ui-open:block">
                                  Select flairs to help others understand what
                                  kind of post this is.
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
                          <Listbox.Options className="z-30 mt-1 flex overflow-x-auto rounded-lg bg-zinc-700">
                            {flairs &&
                              flairs.map((flair) => (
                                <Listbox.Option
                                  key={flair.id}
                                  value={flair.id}
                                  className="flex cursor-pointer justify-between gap-2 px-4 py-2 hover:bg-zinc-600
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
                        handleClick={}
                        colorType="btn-primary"
                        size="btn-md"
                        type="button"
                      >
                        Cancel
                      </PillButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PostEdit;
