import Spinner from "components/Spinner";
import { useMemo, useState } from "react";
import { trpc } from "utils/trpc";

type RecentActivitiesProps = {
  userId: string;
  numberOfRecords?: number;
  withoutTitle?: boolean;
};

const RecentActivities = ({
  userId,
  numberOfRecords,
  withoutTitle,
}: RecentActivitiesProps) => {
  const limit = numberOfRecords ?? 5;
  const {
    data: posts,
    isLoading: postsIsLoading,
    isError: postsIsError,
  } = trpc.post.getByUserIdCursor.useQuery({
    limit: limit,
    userId: userId,
  });
  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = trpc.comment.getByUserIdCursor.useQuery({
    limit: limit,
    userId: userId,
    sortBy: "timeDesc",
  });

  const [mapped, setMapped] = useState<boolean>(false);
  const [sorted, setSorted] = useState<boolean>(false);

  const setArrToMap = () => {
    const activitiesMap = new Map<string | undefined, string | undefined>();
    let i = 0;
    while (i < limit) {
      activitiesMap.set(
        posts?.posts[i]?.id,
        "Created a post: " + posts?.posts[i]?.title
      );
      activitiesMap.set(
        comments?.comments[i]?.id,
        "Commented on: " + comments?.comments[i]?.post.title
      );
      i++;
    }
    setMapped(true);
    return activitiesMap;
  };

  const activitiesMap = useMemo(setArrToMap, [
    comments?.comments,
    posts?.posts,
    numberOfRecords,
  ]);

  const sortActivitiesArr = () => {
    const activitiesArr = posts &&
      comments && [...posts.posts, ...comments.comments];

    activitiesArr?.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    setSorted(true);
    return activitiesArr;
  };

  const activitiesArr = useMemo(sortActivitiesArr, [comments, posts]);

  return (
    <>
      {withoutTitle ? (
        <></>
      ) : (
        <h2 className="font-semibold text-zinc-300 underline decoration-pink-500 decoration-dashed underline-offset-2">
          RECENT ACTIVITIES
        </h2>
      )}
      {(commentsIsLoading || postsIsLoading || !sorted || !mapped) && (
        <Spinner />
      )}
      <div className="flex w-full flex-col gap-1">
        {activitiesArr &&
          activitiesArr.map((activity) => {
            return (
              <p
                key={activity.id}
                className="truncate text-sm text-zinc-400 hover:text-zinc-300"
              >
                {activitiesMap.get(activity.id)}
              </p>
            );
          })}
      </div>
    </>
  );
};

export default RecentActivities;
