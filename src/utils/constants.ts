import algoliasearch from "algoliasearch/lite";
import { env } from "env/client.mjs";

export const INSTANT_SEARCH_INDEX_NAME = env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
export const INSTANT_SEARCH_QUERY_SUGGESTIONS =
  env.NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS;
export const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES = [
  "categories.lvl0",
  "categories.lvl1",
];

export const searchClient = algoliasearch(
  env.NEXT_PUBLIC_ALGOLIA_API_ID,
  env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_KEY
);

export const ALGOLIA_INDEX_NAME = env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

export const PUSHER_APP_ID = env.NEXT_PUBLIC_PUSHER_APP_ID;
export const PUSHER_APP_KEY = env.NEXT_PUBLIC_PUSHER_APP_KEY;
export const PUSHER_APP_CLUSTER = env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;