import PostCard from "components/post/PostCard";
import { trpc } from "utils/trpc";

const MostCommentedPostReport = () => {
  const { data: monthPost, isLoading: monthPostIsLoading } =
    trpc.post.getAllByCursorSortComments.useQuery({
      limit: 1,
      isMonth: true,
    });

  const { data: allPost, isLoading: allPostIsLoading } =
    trpc.post.getAllByCursorSortComments.useQuery({
      limit: 1,
    });
  return (
    <div className="relative flex flex-col items-center gap-4 rounded border border-zinc-700 bg-zinc-800 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-400">
          Flavour of the month:
        </h2>
        {monthPost?.posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
        {monthPost && monthPost.posts.length < 1 && (
          <p className="text-sm text-zinc-400">No one has commented yet.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-400">
          All time discussed:
        </h2>
        {allPost?.posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
};

export default MostCommentedPostReport;
