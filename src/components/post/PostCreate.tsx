import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import Input from "components/form/Input";
import Textarea from "components/form/Textarea";
import { lazy, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { signIn, useSession } from "next-auth/react";
import PillButton from "components/button/PillButton";
import { useModalStore, usePostCreateStore } from "store/postCreateStore";
import { expandVariants } from "utils/framer";
import UserAvatar from "components/avatar/UserAvatar";
import type { CreatePostFormSchemaType } from "types/form";
import { CreatePostFormSchema } from "types/form";
import SolidButton from "components/button/SolidButton";
import { Listbox, Switch, Transition } from "@headlessui/react";
import {
  IconBulb,
  IconCheck,
  IconMessageChatbot,
  IconSpeakerphone,
  IconTag,
} from "@tabler/icons-react";
import LoadingBlur from "components/LoadingBlur";
import Toast from "components/Toast";

const ModalGeneric = lazy(() => import("components/modal/ModalGeneric"));

const PostCreate = () => {
  /*
   * Zustand stores
   */
  const isExpand = usePostCreateStore((state) => state.expand);
  const setExpand = usePostCreateStore((state) => state.updateExpandTrue);
  const setShrink = usePostCreateStore((state) => state.updateExpandFalse);

  const isModalOpen = useModalStore((state) => state.modalOpen);
  const setModalOpen = useModalStore((state) => state.updateModalOpenTrue);
  const setModalClose = useModalStore((state) => state.updateModalOpenFalse);

  /**
   * Clean up stores on unmount
   */
  useEffect(() => {
    return () => {
      setShrink();
      setModalClose();
    };
  }, [setShrink, setModalClose]);

  /*
   * State
   */
  const [isAnnouncement, setIsAnnouncement] = useState<boolean>(false);
  const [sticky, setSticky] = useState<boolean>(false);

  /*
   * Create post and hook form
   */
  const utils = trpc.useContext();
  const { data: discussion } = trpc.category.getCategoryByName.useQuery({
    categoryName: "discussion",
  });
  const { data: announcement } = trpc.category.getCategoryByName.useQuery({
    categoryName: "announcement",
  });
  const { data: stickyAnnouncement } = trpc.category.getCategoryByName.useQuery(
    {
      categoryName: "sticky",
    }
  );
  const createPost = trpc.post.create.useMutation({
    onSuccess() {
      utils.post.getAllCursor.invalidate();
      utils.post.getSticky.invalidate();
      reset();
      setShrink();
    },
  });
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(CreatePostFormSchema),
  });

  /*
   * Flairs
   */
  const { data: flairs } = trpc.post.getAllFlairs.useQuery();
  const [selectedFlair, setSelectedFlair] = useState<string[]>([]);

  /**
   * On submit handler
   */
  const onSubmit = async () => {
    const title: CreatePostFormSchemaType["title"] = getValues("title");
    const description: CreatePostFormSchemaType["description"] =
      getValues("description");
    const announcementId = sticky ? stickyAnnouncement?.id : announcement?.id;

    if (!isDirty) {
      setShrink();
    } else {
      if (!isAnnouncement) {
        createPost.mutate({
          title: title,
          description: description,
          categoryId: discussion?.id ?? "",
          flairIdArr: selectedFlair ?? [],
        });
      } else {
        createPost.mutate({
          title: title,
          description: description,
          categoryId: announcementId ?? "",
          flairIdArr: selectedFlair ?? [],
        });
      }

      reset();
      setSelectedFlair([]);
    }
  };

  /**
   * User auth details
   */
  const { data: sessionData } = useSession();
  const { data: userRole } = trpc.auth.getUserRole.useQuery();
  const isAdminOrMod = userRole === "ADMIN" || userRole === "MOD";

  /*
   * The component should expand when clicked, and will ask if user wants to
   * discard the input fields if click anywhere outside of the component,
   * and shrink if yes
   */
  const [measureRef, { height }] = useMeasure();
  const postCreateRef = useRef<HTMLDivElement>(null);

  const handleClickInside = () => {
    sessionData ? setExpand() : signIn("google");
  };

  const handleClickOutside = () => {
    if (!isDirty) {
      reset();
      clearErrors();
      setShrink();
      setSelectedFlair([]);
    } else setModalOpen();
  };

  const handleClickDiscard = () => {
    if (isModalOpen || !isDirty) {
      setModalClose();
      reset();
      clearErrors();
      setShrink();
      setSelectedFlair([]);
    } else setModalOpen();
  };

  const handleClickCancel = () => {
    setModalClose();
    if (postCreateRef.current)
      postCreateRef.current.scrollIntoView({
        behavior: "smooth",
      });
  };

  useOnClickOutside(postCreateRef, handleClickOutside);

  const variants = expandVariants;

  return (
    <>
      <motion.div
        ref={postCreateRef}
        animate={{ height }}
        transition={{ type: "spring", bounce: 0, duration: 0.7 }}
        className="mb-2"
      >
        <div ref={measureRef}>
          <div className="grid grid-flow-row gap-2 rounded p-4">
            <div className="grid grid-flow-row">
              {/* Visible top part */}
              <div className="mb-4 flex items-center gap-2 place-self-center">
                <UserAvatar size="md" linkToProfile />
                <button
                  onClick={isExpand ? handleClickOutside : handleClickInside}
                  className={`flex gap-2 rounded-full p-4 font-semibold transition
                    ${
                      isExpand
                        ? "border border-purple-600/40 bg-purple-600/20 text-teal-400 hover:bg-purple-600/20"
                        : "bg-zinc-50/10 text-zinc-300 hover:animate-pulse hover:bg-zinc-50/20"
                    }
                  `}
                >
                  <span>
                    {sessionData
                      ? "What's on your mind?"
                      : "Sign in to create post"}
                  </span>
                  <IconBulb
                    className={`${isExpand ? "fill-teal-100" : "fill-none"}`}
                  />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative grid grid-flow-row">
                  {/* Bottom part */}
                  <motion.div
                    className="flex min-w-0 flex-col gap-4 rounded border border-purple-500 bg-zinc-600/20 p-4 shadow"
                    initial={false}
                    variants={variants}
                    animate={isExpand ? "expand" : "shrink"}
                  >
                    {/* Category tabs */}
                    <div className="flex">
                      <SolidButton
                        colorType="btn-primary"
                        size="btn-md"
                        type="button"
                        active={!isAnnouncement}
                        addStyles={`${
                          isAdminOrMod ? "rounded-l-lg" : "rounded-lg"
                        } inline-flex gap-1 transition`}
                        handleClick={() => {
                          setIsAnnouncement(false);
                          setSticky(false);
                          setSelectedFlair([]);
                        }}
                      >
                        <IconMessageChatbot />
                        Discussion
                      </SolidButton>
                      {isAdminOrMod && (
                        <SolidButton
                          colorType="btn-primary"
                          size="btn-md"
                          type="button"
                          active={isAnnouncement}
                          addStyles="inline-flex gap-1 rounded-r-lg transition"
                          handleClick={() => {
                            setIsAnnouncement(true);
                            setSelectedFlair([]);
                          }}
                        >
                          <IconSpeakerphone />
                          Announcement
                        </SolidButton>
                      )}
                    </div>

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

                    {/* Sticky toggle */}
                    {isAnnouncement && (
                      <div className="flex justify-start gap-2">
                        <Switch
                          checked={sticky}
                          onChange={setSticky}
                          className={`${
                            sticky ? "bg-pink-600" : "bg-gray-400"
                          } relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              sticky ? "translate-x-6" : "translate-x-0"
                            } inline-block h-7 w-7 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                        <span
                          className={`${
                            sticky ? "text-zinc-200" : "text-zinc-500"
                          } cursor-default select-none transition`}
                        >
                          Sticky
                        </span>
                      </div>
                    )}

                    {/* Description field */}
                    <Textarea
                      name="description"
                      placeholder={`${
                        sticky
                          ? "Disabled for sticky announcements."
                          : "(Optional) Something that describes the nature of the post."
                      }`}
                      label="Description"
                      register={register}
                      addStyles="h-32 outline-teal-500"
                      disabled={sticky}
                    />

                    {/* Flairs */}
                    <Listbox
                      value={selectedFlair}
                      onChange={setSelectedFlair}
                      multiple
                      horizontal
                      disabled={sticky}
                    >
                      <div className="relative flex flex-col items-start overflow-x-auto">
                        <div className="flex gap-2">
                          <Listbox.Button className="group flex items-center gap-2 ui-disabled:cursor-not-allowed">
                            <span
                              className="rounded-full bg-zinc-50/10 p-1 text-zinc-300 transition hover:bg-zinc-50/20
                              ui-open:bg-violet-400/20 ui-open:text-teal-500 ui-disabled:bg-zinc-400/10 ui-disabled:hover:bg-zinc-50/10"
                            >
                              <IconTag />
                            </span>
                            {flairs &&
                            selectedFlair &&
                            selectedFlair.length > 0 ? (
                              selectedFlair.map((selectedFlairId) => {
                                let flairName = "";
                                for (const flair of flairs) {
                                  if (flair.id === selectedFlairId)
                                    flairName = flair.flairName;
                                }
                                return (
                                  <span
                                    className="shrink-0 cursor-pointer items-center rounded-full px-3 text-zinc-200
                                      transition odd:bg-pink-400/20 even:bg-violet-400/20 hover:odd:bg-pink-400/30 hover:even:bg-violet-400/30"
                                    key={selectedFlairId}
                                  >
                                    {flairName}
                                  </span>
                                );
                              })
                            ) : (
                              <>
                                <span className="hidden text-justify text-sm text-zinc-300 transition ui-open:block">
                                  Select flairs to help others understand what
                                  kind of post this is.
                                </span>
                                <span className="text-zinc-400 group-hover:text-zinc-200 ui-open:hidden ui-disabled:group-hover:text-zinc-400">
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
                          <Listbox.Options className="z-30 mt-1 flex rounded-lg bg-zinc-700">
                            {flairs &&
                              flairs.map((flair) => (
                                <Listbox.Option
                                  key={flair.id}
                                  value={flair.id}
                                  className="flex shrink-0 cursor-pointer justify-between gap-2 rounded-lg px-4 py-2 hover:bg-zinc-600
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
                        Post
                      </button>
                      <PillButton
                        handleClick={handleClickDiscard}
                        colorType="btn-primary"
                        size="btn-md"
                        type="button"
                      >
                        Cancel
                      </PillButton>
                    </div>
                  </motion.div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {createPost.isLoading && <LoadingBlur />}
      </motion.div>

      <ModalGeneric
        title="Discard post?"
        description=""
        handleClick={handleClickDiscard}
        handleClickNo={handleClickCancel}
        colorType="btn-secondary"
        size="btn-md"
        type="button"
        buttonYes="Discard"
        buttonNo="Cancel"
      />

      {createPost.isSuccess && (
        <Toast type="SUCCESS" message="Post successfully created" />
      )}

      {createPost.isError && <Toast type="ERROR" message="An error occurred" />}
    </>
  );
};

export default PostCreate;
