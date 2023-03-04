import Spinner from "components/Spinner";
import { useMemo, useState } from "react";
import { trpc } from "utils/trpc";

type RecentActivitiesProps = {
  userId: string;
  numberOfRecords: number;
};

const RecentActivities = ({
  userId,
  numberOfRecords,
}: RecentActivitiesProps) => {
  const {
    data: posts,
    isLoading: postsIsLoading,
    isError: postsIsError,
  } = trpc.post.getByUserIdCursor.useQuery({
    limit: numberOfRecords,
    userId: userId,
  });
  const {
    data: comments,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = trpc.comment.getByUserIdCursor.useQuery({
    limit: numberOfRecords,
    userId: userId,
    sortBy: "timeDesc",
  });

  const [mapped, setMapped] = useState<boolean>(false);
  const [sorted, setSorted] = useState<boolean>(false);

  const setArrToMap = () => {
    const activitiesMap = new Map<string | undefined, string | undefined>();
    let i = 0;
    while (i < numberOfRecords) {
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
      <h2 className="text-zinc-200">Recent Activities</h2>
      {(commentsIsLoading || postsIsLoading || !sorted || !mapped) && (
        <Spinner />
      )}
      <div className="flex w-full flex-col gap-1">
        {activitiesArr &&
          activitiesArr.map((activity) => {
            return (
              <p key={activity.id} className="truncate text-sm text-zinc-300">
                {activitiesMap.get(activity.id)}
              </p>
            );
          })}
      </div>
    </>
  );
};

export default RecentActivities;
