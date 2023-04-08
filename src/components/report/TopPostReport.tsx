import { Menu } from "@headlessui/react";
import { IconMessage2, IconThumbUpFilled } from "@tabler/icons-react";
import Vote from "components/Vote";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";

type TopPostReportProps = {
  type: "VOTES" | "COMMENTS";
};

const TopPostReport = ({ type }: TopPostReportProps) => {
  const [limit, setLimit] = useState<number>(5);

  const { data: topPostList } = trpc.post.getAllByCursorSortComments.useQuery({
    limit: limit,
  });

  return topPostList ? (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-8">
        <h3 className="text-lg font-bold text-zinc-400">Top posts all-time:</h3>
        <Menu as="div" className="relative">
          <Menu.Button className="rounded px-4 py-2 transition ui-open:bg-zinc-700 ui-open:text-zinc-300 ui-not-open:bg-zinc-800 ui-not-open:text-zinc-400 ui-not-open:hover:bg-zinc-600">
            Records: {limit}
          </Menu.Button>
          <Menu.Items className="absolute top-11">
            <Menu.Item
              as="button"
              onClick={() => setLimit(5)}
              className={`w-full px-4 py-2 ${
                limit === 5
                  ? "bg-zinc-600 text-zinc-300"
                  : "bg-zinc-700 text-zinc-400 transition hover:bg-zinc-600"
              }`}
            >
              5
            </Menu.Item>
            <Menu.Item
              as="button"
              onClick={() => setLimit(10)}
              className={`w-full px-4 py-2 ${
                limit === 10
                  ? "bg-zinc-600 text-zinc-300"
                  : "bg-zinc-700 text-zinc-400 transition hover:bg-zinc-600"
              }`}
            >
              10
            </Menu.Item>
            <Menu.Item
              as="button"
              onClick={() => setLimit(15)}
              className={`w-full px-4 py-2 ${
                limit === 15
                  ? "bg-zinc-600 text-zinc-300"
                  : "bg-zinc-700 text-zinc-400 transition hover:bg-zinc-600"
              }`}
            >
              15
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      <div className="flex max-h-64 max-w-md flex-col gap-2 overflow-y-auto px-4">
        {topPostList.posts.map((post) => {
          return (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group flex items-center justify-between gap-4"
            >
              <p className="truncate text-sm text-zinc-400 group-hover:text-zinc-300">
                {post.title}
              </p>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400">
                {format(post.createdAt, "dd/MM/yy")}
              </p>
              <div>
                {type === "VOTES" ? (
                  <Vote type="post" postId={post.id} isFlexRow />
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 text-zinc-400">
                      <IconMessage2 />
                      {post.comments.length}
                    </div>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default TopPostReport;
