import { useCallback, useEffect, useRef, useState } from "react";
import {
  useScrollPositionDebounce,
  useScrollPositionThrottle,
} from "utils/hooks";
import { trpc } from "utils/trpc";
import PostCard from "./PostCard";
import PostLoadingSkeleton from "./PostLoadingSkeleton";

type PostListProps = {
  children?: React.ReactNode;
};

const PostList = (props: PostListProps) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const viewportPosition = useRef({ x: 0, y: 0 });

  useScrollPositionDebounce(
    ({ currPos }) => {
      setScrollPosition(Math.abs(currPos.y) + window.innerHeight);
      console.log(Math.abs(currPos.y) + window.innerHeight);
    },
    undefined,
    undefined,
    undefined,
    500
  );

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = trpc.post.getPostInfinite.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    }
  );

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

      {!hasNextPage && <div>You reached the end of the page.</div>}
    </>
  );
};

export default PostList;
