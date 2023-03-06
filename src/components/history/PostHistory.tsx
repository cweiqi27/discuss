import {
  IconMessage,
  IconMessageChatbot,
  IconSpeakerphone,
  IconSticker,
} from "@tabler/icons-react";
import LoadingBlur from "components/LoadingBlur";
import Spinner from "components/Spinner";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { trpc } from "utils/trpc";

type PostHistoryProps = {
  userId: string;
  size?: "sm" | "md" | "lg";
};

const PostHistoryList = ({ userId, size }: PostHistoryProps) => {
  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } =
    trpc.post.getByUserIdCursor.useInfiniteQuery(
      {
        limit: 10,
        userId: userId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const handleClickViewMore = () => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  const formatPostsDate = () => {
    const posts = data?.pages.flatMap((page) => page.posts) ?? [];
    const dateSet = new Set();
    const isShowDateMap = new Map<string, boolean>();

    return posts.map((post) => {
      const date = format(post.createdAt, "MMMM do, yyyy");
      const time = format(post.createdAt, "KK:mm a");
      const category = post.category.categoryName;
      const id = post.id;
      const title = post.title;

      const commentCount =
        post.comments.length > 0 ? post.comments.length : null;
      if (!dateSet.has(date)) {
        dateSet.add(date);
        isShowDateMap.set(post.id, true);
      } else isShowDateMap.set(post.id, false);

      return { isShowDateMap, date, time, category, id, title, commentCount };
    });
  };

  const formattedPosts = useMemo(formatPostsDate, [data?.pages]);

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded border border-zinc-800 bg-zinc-900/80 px-2 transition hover:border-purple-900">
        <div className="flex flex-col gap-2 ">
          {formattedPosts.length > 0 ? (
            <>
              <h2 className="py-2 text-2xl font-bold text-zinc-200">
                Post History
              </h2>

              <div
                className={`relative ${
                  size === "sm"
                    ? "max-h-48 overflow-y-auto"
                    : size === "md"
                    ? "max-h-64  overflow-y-auto"
                    : size === "lg"
                    ? "max-h-108 overflow-y-auto"
                    : ""
                }`}
              >
                {formattedPosts.map((post) => {
                  return (
                    <>
                      {post.isShowDateMap.get(post.id) && (
                        <div className="sticky top-0 rounded bg-purple-900 px-2 pt-1 pb-2 shadow">
                          <h3 className="cursor-default text-xs font-semibold text-zinc-300">
                            {post.date}
                          </h3>
                        </div>
                      )}
                      <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        className="flex items-center justify-between rounded bg-zinc-900 px-4 py-2 hover:bg-zinc-800"
                      >
                        <div className="inline-flex max-w-xs gap-2">
                          <span className="text-zinc-300">
                            {post.category === "discussion" ? (
                              <IconMessageChatbot />
                            ) : post.category === "announcement" ? (
                              <IconSpeakerphone />
                            ) : post.category === "sticky" ? (
                              <IconSticker />
                            ) : (
                              <></>
                            )}
                          </span>
                          <p className="truncate text-zinc-300">{post.title}</p>
                        </div>
                        {post.commentCount && (
                          <div className="inline-flex gap-1">
                            <IconMessage className="text-zinc-300" />
                            <span className="text-zinc-300">
                              {post.commentCount}
                            </span>
                          </div>
                        )}
                        <span className="text-zinc-300">{post.time}</span>
                      </Link>
                    </>
                  );
                })}
                {hasNextPage && (
                  <button
                    className="bg-zinc-000 group relative flex w-full justify-center rounded py-1 transition hover:bg-zinc-800"
                    onClick={handleClickViewMore}
                  >
                    {isFetching ? (
                      <span className="py-1">
                        <Spinner />
                      </span>
                    ) : (
                      <span className="text-zinc-400">View more</span>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : isFetching ? (
            <LoadingBlur />
          ) : (
            <div className="text-zinc-400">This user has never posted.</div>
          )}
        </div>
        {/* {isFetching && <LoadingBlur />} */}
      </div>
    </>
  );
};

export default PostHistoryList;
