import { publicProcedure, router } from "../trpc";

export const algoliaRouter = router({
  pushIndex: publicProcedure.query(({ ctx }) => {
    const record = { objectID: 2, name: "test" };
    ctx.algolia.saveObject(record).wait();

    // Search the index and print the results
    ctx.algolia.search("test").then(({ hits }) => {
      return hits[0];
    });
  }),
});
