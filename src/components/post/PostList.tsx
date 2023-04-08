import { useEffect, useState } from "react";
import { useScrollPositionDebounce } from "utils/scroll";
import { trpc } from "utils/trpc";
import PostCard from "./PostCard";
import PostLoadingSkeleton from "./PostLoadingSkeleton";

type PostListProps = {
  categoryName?: string;
  flairId?: string;
};

const PostList = ({ categoryName, flairId }: PostListProps) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useScrollPositionDebounce(
    ({ currPos }) => {
      setScrollPosition(Math.abs(currPos.y) + window.innerHeight);
    },
    undefined,
    undefined,
    undefined,
    500
  );

  const { data: category } = trpc.category.getByName.useQuery(
    {
      name: categoryName ?? "",
    },
    { enabled: categoryName !== undefined }
  );

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = categoryName
    ? trpc.post.getByCategoryCursor.useInfiniteQuery(
        {
          limit: 5,
          categoryId: category?.id ?? "",
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    : trpc.post.getByFlairCursor.useInfiniteQuery({
        limit: 5,
        flairId: flairId ?? "",
      });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

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

  return isLoading ? (
    <>
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </>
  ) : (
    <>
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}

      {isFetching && <PostLoadingSkeleton />}

      {!hasNextPage && (
        <div className="italic text-zinc-500">
          You&apos;ve reached the world&apos;s edge, none but devils play past
          here.
        </div>
      )}
    </>
  );
};

export default PostList;
