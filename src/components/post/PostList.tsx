import { trpc } from "utils/trpc";
import PostCard from "./PostCard";
import PostLoadingSkeleton from "./PostLoadingSkeleton";

type PostListProps = {
  children?: React.ReactNode;
};

const PostList = (props: PostListProps) => {
  const { data, isLoading } = trpc.post.getInfinitePost.useQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return isLoading ? (
    <>
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </>
  ) : (
    <>
      {data?.posts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
    </>
  );
};

export default PostList;
