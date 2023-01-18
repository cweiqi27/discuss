import { z } from "zod";

// Schema
export const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().nullish(),
  sticky: z.boolean().nullish(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

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
