import { publicProcedure, router } from "../trpc";

export const algoliaRouter = router({
  pushAllIndex: publicProcedure.query(async ({ ctx }) => {
    try {
      const userRecordsObj: {
        objectID: string;
        name: string | null;
        image: string | null;
        type: "User";
      }[] = [];

      const postRecordsObj: {
        objectID: string;
        title: string;
        description: string | null;
        author: string | null;
        createdAt: Date;
        flairs: string[];
        category: string;
        type: "Post";
      }[] = [];

      const flairsRecordsObj: {
        objectID: string;
        flairName: string;
        type: "Flair";
      }[] = [];

      const userRecords = await ctx.prisma.user
        .findMany({
          select: {
            id: true,
            name: true,
            image: true,
          },
        })
        .then((records) => {
          records.map(({ id, name, image }) => {
            userRecordsObj.push({
              objectID: id,
              name: name,
              image: image,
              type: "User",
            });
          });
        })
        .then(() => {
          ctx.algolia.saveObjects(userRecordsObj);
        });

      const postRecords = await ctx.prisma.post
        .findMany({
          where: {
            status: "PRESENT",
          },
          select: {
            id: true,
            title: true,
            description: true,
            user: {
              select: {
                name: true,
              },
            },
            createdAt: true,
            flairs: {
              select: {
                flair: {
                  select: {
                    flairName: true,
                  },
                },
              },
            },
            category: {
              select: {
                categoryName: true,
              },
            },
          },
        })
        .then((records) => {
          records.map(
            ({ id, title, description, user, flairs, createdAt, category }) => {
              postRecordsObj.push({
                objectID: id,
                title: title,
                description: description,
                author: user.name,
                createdAt: createdAt,
                flairs: flairs.map((flair) => {
                  return flair.flair.flairName;
                }),
                category: category.categoryName,
                type: "Post",
              });
            }
          );
        })
        .then(() => ctx.algolia.saveObjects(postRecordsObj));

      const flairsRecords = await ctx.prisma.flair
        .findMany()
        .then((records) => {
          records.map(({ id, flairName }) => {
            flairsRecordsObj.push({
              objectID: id,
              flairName: flairName,
              type: "Flair",
            });
          });
        })
        .then(() => ctx.algolia.saveObjects(flairsRecordsObj));

      return { userRecords, postRecords, flairsRecords };
    } catch (e) {
      console.log(e);
    }
  }),
  getClient: publicProcedure.query(({ ctx }) => {
    return ctx.algoliaClient;
  }),
});
