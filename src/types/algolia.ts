import type { Hit as AlgoliaHit } from "@algolia/client-search";

export type HitProps = {
  hit: AlgoliaHit<{
    objectID: string;
    name?: string;
    image?: string;
    title?: string;
    description?: string;
    flairName?: string;
    author?: string;
    flairs?: string[];
    category?: string;
    createdAt?: Date;
    type?: "User" | "Post" | "Flair";
  }>;
};
