import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import Input from "components/form/Input";
import Card from "components/layout/Card";

const FormSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const PostCreate = () => {
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

    console.log("Title: " + title + "Description: " + description);

    createPost.mutate({
      title: title,
      description: description,
      userId: "clc3ind8m0000dz6wyfe07psp",
      categoryId: 31,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Input type="text" name="title" label="Title" register={register} />
        <Input
          type="textarea"
          name="description"
          placeholder="Description(optional)"
          label="Description"
          register={register}
          addStyles="h-32"
        />
        <button type="submit">SUBMIT</button>
      </Card>
    </form>
  );
};

export default PostCreate;
