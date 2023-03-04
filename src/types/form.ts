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

export type EditPostFormSchemaType = z.infer<typeof EditPostFormSchema>;

export const CreateCommentFormSchema = z.object({
  content: z.string().min(1, { message: "Content is required." }),
});

export type CreateCommentFormSchemaType = z.infer<
  typeof CreateCommentFormSchema
>;

export const EditProfileBioFormSchema = z.object({
  bio: z.string().min(1, { message: "Bio is required." }),
});

export type EditProfileBioFormSchemaType = z.infer<
  typeof EditProfileBioFormSchema
>;
