import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import Input from "components/form/Input";
import Card from "components/layout/Card";
import Textarea from "components/form/Textarea";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { motion, Variants } from "framer-motion";
import useMeasure from "react-use-measure";
import Avatar from "components/Avatar/Avatar";
import ModalGeneric from "components/modal/ModalGeneric";
import { useSession } from "next-auth/react";
import SolidButton from "components/button/SolidButton";
import PillButton from "components/button/PillButton";

/*
 * Validators for form fields
 */
const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().nullish(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const PostCreate = () => {
  /*
   * Get user image
   */
  const { data: userImage } = trpc.auth.getUserImg.useQuery();
  const { data: userId } = trpc.auth.getUserId.useQuery();

  /*
   * Create post and hook form
   */
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

    if (!isDirty) {
      setIsExpand(false);
    } else {
      createPost.mutate({
        title: title,
        description: description,
        userId: userId ?? "",
        categoryId: 31,
      });

      reset();
      setIsExpand(false);
    }
  };

  /*
   * The component should expand when clicked, and will ask if user wants to
   * discard the input fields if click anywhere outside of the component,
   * and shrink if yes
   */
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [measureRef, { height }] = useMeasure();
  const postCreateRef = useRef<HTMLDivElement>(null);
  const { data: sessionData } = useSession();

  const handleClickInside = () => {
    sessionData ? !isExpand && setIsExpand(true) : alert("Not signed in");
  };

  const handleClickOutside = () => {
    if (!isDirty) {
      clearErrors();
      setIsExpand(false);
    } else setIsModalOpen(true);
  };

  const handleClickDiscard = () => {
    if (!isDirty || isModalOpen) {
      setIsModalOpen(false);
      reset();
      clearErrors();
      setIsExpand(false);
    } else setIsModalOpen(true);
  };

  const handleClickCancel = () => {
    setIsModalOpen(false);
    if (postCreateRef.current)
      postCreateRef.current.scrollIntoView({
        behavior: "smooth",
      });
  };

  useOnClickOutside(postCreateRef, handleClickOutside);

  const variants: Variants = {
    expand: {
      display: "flex",
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 1,
        bounce: 0,
      },
    },
    shrink: {
      y: -60,
      transition: { duration: 0.2 },
      opacity: 0,
      transitionEnd: { display: "none" },
    },
  };

  return (
    <>
      <motion.div
        ref={postCreateRef}
        animate={{ height }}
        transition={{ type: "spring", bounce: 0, duration: 0.7 }}
        className="mb-2"
      >
        <div ref={measureRef}>
          <div className="flex flex-col gap-2 rounded p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative grid grid-flow-row">
                {/* Visible top part */}
                <div className="grid auto-cols-max grid-flow-col grid-rows-2 place-content-center gap-x-4 pt-6 pl-4 pr-8 sm:auto-cols-auto sm:place-content-stretch">
                  <Avatar
                    src={userImage ?? ""}
                    alt="Me"
                    addStyles="col-start-1 col-end-2 place-self-end"
                  />
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
      </motion.div>

      <ModalGeneric
        title="Discard post?"
        description="discard post discard post deez nuts"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
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
