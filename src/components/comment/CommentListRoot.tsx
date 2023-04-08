import { Menu } from "@headlessui/react";
import { Status } from "@prisma/client";
import SortByButton from "components/SortByButton";
import { useEffect, useState } from "react";
import { useSortStore } from "store/sortStore";
import { useScrollPositionDebounce } from "utils/scroll";
import { trpc } from "utils/trpc";
import CommentCard from "./CommentCard";
import CommentLoadingSkeleton from "./CommentLoadingSkeleton";

type CommentListRootProps = {
  postId: string;
  postStatus: Status;
};

const CommentListRoot = ({ postId, postStatus }: CommentListRootProps) => {
  const sortBy = useSortStore((state) => state.sortBy);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const { data: userRole } = trpc.auth.getUserRole.useQuery();
  const { data: userId } = trpc.auth.getUserId.useQuery();

  useScrollPositionDebounce(
    ({ currPos }) => {
      setScrollPosition(Math.abs(currPos.y) + window.innerHeight);
    },
    undefined,
    undefined,
    undefined,
    500
  );

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchedAfterMount,
  } = trpc.comment.getAllCursor.useInfiniteQuery(
    {
      limit: 5,
      postId: postId,
      sortBy: sortBy,
      parentId: null,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  useEffect(() => {
    if (
      !isFetching &&
      !isFetchingNextPage &&
      hasNextPage &&
      scrollPosition >= document.body.offsetHeight - 150
    )
      fetchNextPage();
  }, [
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    scrollPosition,
    fetchNextPage,
  ]);

  return (
    <div className="rounded border border-zinc-500 bg-zinc-800 py-2 px-4">
      {comments.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-zinc-300">Comments</h1>
            <div className="flex">
              <SortByButton />
            </div>
          </div>
          <div className="mt-4 rounded-lg border-y border-zinc-600 bg-zinc-900">
            {comments.map((comment) => {
              return (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postStatus={postStatus}
                  userId={userId}
                  userRole={userRole}
                />
              );
            })}
          </div>
        </>
      )}

      {!isFetchedAfterMount && isFetching && (
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-zinc-300">Comments</h1>
          <div className="inline-flex cursor-default items-center gap-1 rounded-lg bg-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-600">
            Sort by: ...
          </div>
          <div className="mt-4 rounded-lg border-y border-zinc-600 bg-zinc-900">
            <CommentLoadingSkeleton />
            <CommentLoadingSkeleton />
            <CommentLoadingSkeleton />
          </div>
        </div>
      )}

      {isFetchedAfterMount && isFetching && (
        <div className="space-y-2">
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
          <CommentLoadingSkeleton />
        </div>
      )}

      {!isFetching && comments.length < 1 && (
        <>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-zinc-300">Comments</h1>
            <div className="inline-flex cursor-default items-center gap-1 rounded-lg bg-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-600">
              Sort by: ...
            </div>
          </div>
          <div className="mt-6 mb-4 flex">
            <span className="text-lg text-zinc-300">No comment yet...</span>
          </div>
        </>
      )}

      {!hasNextPage && <></>}
    </div>
  );
};

export default CommentListRoot;
