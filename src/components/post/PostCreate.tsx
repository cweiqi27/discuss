import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import Input from "components/form/Input";
import Textarea from "components/form/Textarea";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import ModalGeneric from "components/modal/ModalGeneric";
import { useSession } from "next-auth/react";
import PillButton from "components/button/PillButton";
import { useModalStore, usePostCreateStore } from "store/postStore";
import { expandVariants } from "utils/framer";
import UserAvatar from "components/avatar/UserAvatar";
import type { FormSchemaType } from "types/form";
import { FormSchema } from "types/form";
import SolidButton from "components/button/SolidButton";

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

  /*
   * Create post and hook form
   */
  const { data: userId } = trpc.auth.getUserId.useQuery();
  const createPost = trpc.post.createPost.useMutation();
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async () => {
    const title: FormSchemaType["title"] = getValues("title");
    const description: FormSchemaType["description"] = getValues("description");
    const sticky: FormSchemaType["sticky"] = getValues("sticky");

    if (!isDirty) {
      setShrink();
    } else {
      createPost.mutate({
        title: title,
        description: description,
        userId: userId ?? "",
        categoryId: 31,
      });

      reset();
      setShrink();
    }
  };

  /*
   * The component should expand when clicked, and will ask if user wants to
   * discard the input fields if click anywhere outside of the component,
   * and shrink if yes
   */
  const [measureRef, { height }] = useMeasure();
  const postCreateRef = useRef<HTMLDivElement>(null);
  const { data: sessionData } = useSession();

  const handleClickInside = () => {
    sessionData ? setExpand() : alert("Not signed in");
  };

  const handleClickOutside = () => {
    if (!isDirty) {
      clearErrors();
      setShrink();
    } else setModalOpen();
  };

  const handleClickDiscard = () => {
    if (isModalOpen || !isDirty) {
      setModalClose();
      reset();
      clearErrors();
      setShrink();
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
      <motion.section
        ref={postCreateRef}
        animate={{ height }}
        transition={{ type: "spring", bounce: 0, duration: 0.7 }}
        className="sticky mb-2"
      >
        <div ref={measureRef}>
          <div className="flex flex-col gap-2 rounded p-4">
            <div className="relative grid grid-flow-row">
              {/* Visible top part */}

              <UserAvatar />
              {/* Title field */}
              <SolidButton
                handleClick={handleClickInside}
                colorType="btn-primary"
                size="btn-md"
                type="button"
              >
                Click inside
              </SolidButton>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative grid grid-flow-row">
                  {/* Visible top part */}
                  <div className="grid auto-cols-max grid-flow-col grid-rows-2 place-content-center gap-x-4 pt-6 pl-4 pr-8 sm:auto-cols-auto sm:place-content-stretch">
                    {/* Title field */}
                    <Input
                      type="text"
                      name="title"
                      register={register}
                      placeholder={isExpand ? "Title" : "Create Post"}
                      click={handleClickInside}
                      addStyles="col-start-2 col-end-11 outline-teal-500"
                    />
                    <div className="cold-end-13 col-start-11" />
                    <ErrorMessage
                      errors={errors}
                      name="title"
                      as="span"
                      className="col-start-2 col-end-11 text-pink-400"
                    />
                  </div>

                  {/* Bottom part */}
                  <motion.div
                    className="flex flex-col gap-4 rounded  bg-zinc-600/20 p-4 shadow shadow-purple-500"
                    initial={false}
                    variants={variants}
                    animate={isExpand ? "expand" : "shrink"}
                  >
                    <Textarea
                      name="description"
                      placeholder="Description (optional)"
                      label="Description"
                      register={register}
                      addStyles="h-32 outline-teal-500"
                    />
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
      </motion.section>

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
    </>
  );
};

export default PostCreate;
