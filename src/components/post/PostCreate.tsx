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
import Avatar from "components/Avatar";

const FormSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const PostCreate = () => {
  /*
   * The component should expand when clicked, and shrink when click anywhere outside the component
   */
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [measureRef, { height }] = useMeasure();
  const ref = useRef(null);

  const handleClickOutside = () => {
    isExpand && setIsExpand(false);
  };

  const handleClickInside = () => {
    !isExpand && setIsExpand(true);
  };

  useOnClickOutside(ref, handleClickOutside);

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
    handleSubmit,
    watch,
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
  };

  return (
    <motion.div
      ref={ref}
      animate={{ height }}
      transition={{ type: "spring", duration: 0.7 }}
      className="sticky top-0"
    >
      <div ref={measureRef}>
        <Card addStyles="rounded gap-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4">
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
              className="flex flex-col"
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
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default PostCreate;
