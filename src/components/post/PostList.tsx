import { useEffect, useState } from "react";
import { useScrollPositionDebounce } from "utils/hooks";
import { trpc } from "utils/trpc";
import PostCard from "./PostCard";
import PostLoadingSkeleton from "./PostLoadingSkeleton";

type PostListProps = {
  children?: React.ReactNode;
  categoryName: string;
};

const PostList = (props: PostListProps) => {
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

  const { data: category } = trpc.category.getCategoryByName.useQuery({
    categoryName: props.categoryName,
  });

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = trpc.post.getAllCursor.useInfiniteQuery(
    {
      limit: 5,
      categoryId: category?.id ?? "",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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
