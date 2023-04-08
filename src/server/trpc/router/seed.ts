import { Post, User } from "@prisma/client";
import { z } from "zod";
import { modProcedure, publicProcedure, router } from "../trpc";
import { faker } from "@faker-js/faker";

export const seedRouter = router({
  seedPost: publicProcedure.mutation(async ({ ctx }) => {
    const categoryIds: string[] = [
      "clek0n3jr0000dz6gvqahxun3",
      "clek0n3jr0001dz6gh2bqink6",
      "clek0n3js0002dz6gvxdbr8a8",
    ];
    const userIds: string[] = [
      "clejwn26n0000dzvs58lwxyij",
      "clejz2fry0006dzvsht60equd",
      "clejzjvxi000bdzvs6hdbcnwf",
      "clejztiji000idzvs6qly11k5",
      "cletxu1j00002jl086d97okpc",
      "cleu8d4md0000jm09wr0xvlmu",
      "clewyv3ur000dl708uk73kiat",
      "clf09dvs80004dznk8x2vbtj5",
    ];

    const date = faker.date.between(
      "2023-01-01T00:00:00.000Z",
      "2023-03-01T00:00:00.000Z"
    );
    const randDate = [
      date,
      faker.date.between(date, "2023-03-10T00:00:00.000Z"),
    ];
    return await ctx.prisma.post
      .create({
        data: {
          title: faker.random.words(Math.random() * (20 - 1) + 1),
          description: faker.random.words(Math.random() * 50),
          category: {
            connect: {
              id: categoryIds[0],
            },
          },
          createdAt: date,
          updatedAt: randDate[5],
          user: {
            connect: {
              id: userIds[2],
            },
          },
        },
        include: { user: true, category: true },
      })
      .then(({ id, title, description, user, createdAt, category }) => {
        ctx.algolia.saveObject({
          objectID: id,
          title: title,
          description: description,
          author: user.name,
          createdAt: createdAt,
          category: category.categoryName,
          type: "Post",
        });
      });
    // }
  }),
});
