import { SubmitHandler, useForm } from "react-hook-form";
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

const FormSchema = z.object({
  title: z.string(),
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
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });

  const onSubmit = async () => {
    const title: FormSchemaType["title"] = getValues("title") || null;
    const description: FormSchemaType["description"] = getValues("description");

    createPost.mutate({
      title: title,
      description: description,
      userId: userId ?? "",
      categoryId: 31,
    });

    reset();
    setIsExpand(false);
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

  const handleClickOutside = () => {
    isExpand && setIsModalOpen(true);
  };

  const handleClickInside = () => {
    sessionData ? !isExpand && setIsExpand(true) : alert("Not signed in");
  };

  const handleClickDiscard = () => {
    setIsModalOpen(false);
    setIsExpand(false);
    reset();
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
        duration: 0.7,
      },
    },
    shrink: {
      y: -40,
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
        transition={{ type: "spring", duration: 0.7 }}
        className="mb-8"
      >
        <div ref={measureRef}>
          <Card addStyles="rounded gap-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <div className="z-10 flex w-full gap-4">
                  <Avatar src={userImage ?? ""} alt="Me" />
                  <Input
                    type="text"
                    name="title"
                    register={register}
                    placeholder={isExpand ? "Title" : "Create Post"}
                    click={handleClickInside}
                    addStyles="w-full"
                  />
                </div>
                <motion.div
                  className="flex flex-col p-4"
                  initial={false}
                  variants={variants}
                  animate={isExpand ? "expand" : "shrink"}
                >
                  <Textarea
                    name="description"
                    placeholder="Description (optional)"
                    label="Description"
                    register={register}
                    addStyles="h-32 outline-purple-500"
                  />
                  <div className="mt-2 flex">
                    <input
                      type="submit"
                      value="Post"
                      className="cursor-pointer rounded-full bg-zinc-200 py-2 px-4 transition hover:bg-zinc-300"
                    />
                  </div>
                </motion.div>
              </div>
            </form>
          </Card>
        </div>
      </motion.div>

      <ModalGeneric
        title="Discard post?"
        description="discard post discard post deez nuts"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        handleClick={handleClickDiscard}
        handleClickNo={handleClickCancel}
        type="btn-secondary"
        size="btn-md"
        buttonYes="Discard"
        buttonNo="Cancel"
      />
    </>
  );
};

export default PostCreate;
