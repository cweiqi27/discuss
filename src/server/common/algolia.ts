import algoliasearch from "algoliasearch";
import { env as serverEnv } from "env/server.mjs";
import { env as clientEnv } from "env/client.mjs";

export const client = algoliasearch(
  clientEnv.NEXT_PUBLIC_ALGOLIA_API_ID,
  serverEnv.ALGOLIA_ADMIN_KEY
);

export const algoliaIndex = client.initIndex(
  clientEnv.NEXT_PUBLIC_ALGOLIA_INDEX_NAME
);
