import { z } from "zod";

// Schema
export const CreatePostFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().nullish(),
  sticky: z.boolean().nullish(),
});

export type CreatePostFormSchemaType = z.infer<typeof CreatePostFormSchema>;

export const EditPostFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().nullish(),
});

export type EditPostFormSchema = z.infer<typeof EditPostFormSchema>;

export const CreateCommentFormSchema = z.object({
  content: z.string().min(1, { message: "" }),
});

export type CreateCommentFormSchemaType = z.infer<
  typeof CreateCommentFormSchema
>;

// Discussion form type
type PostFormType = {
  title: string;
  description?: string;
};

type DiscussionFormType = PostFormType & {
  flair?: number[];
};

type AnnouncementFormType = PostFormType & {
  isSticky?: boolean;
};
