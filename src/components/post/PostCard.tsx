import { Menu } from "@headlessui/react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import Avatar from "components/avatar/Avatar";
import CommentButton from "components/comment/CommentButton";
import DotsMenu from "components/DotsMenu";
import {
  differenceInDays,
  format,
  formatDistanceToNow,
  isEqual,
  isThisYear,
} from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import PostContent from "./PostContent";
import PostFlairList from "./PostFlairList";
import PostTitle from "./PostTitle";
import Vote from "../Vote";

type PostCardProps = {
  post: RouterOutputs["post"]["getByCategoryCursor"]["posts"][number];
};

const PostCard = ({ post }: PostCardProps) => {
  const { data: userRole } = trpc.auth.getUserRole.useQuery();
  const { data: userId } = trpc.auth.getUserId.useQuery();
  const { data: discussion } = trpc.category.getByName.useQuery({
    name: "discussion",
  });

  const formatPostDate = () => {
    return differenceInDays(Date.now(), post.createdAt) < 2
      ? formatDistanceToNow(post.createdAt)
      : isThisYear(post.createdAt)
      ? format(post.createdAt, "MMM do")
      : format(post.createdAt, "yyyy MMM dd");
  };

  const formattedPostDate = useMemo(formatPostDate, [post.createdAt]);

  const editedDate = useMemo(() => {
    return formatDistanceToNow(post.updatedAt);
  }, [post.updatedAt]);

  // const handleClickShare = () => {
  //   if (navigator.canShare()) {
  //     navigator
  //       .share({
  //         url: `https://share.toogoodtogo.com/store/1006/milestones/meals-saved/`,
  //       })
  //       .then(() => {
  //         console.log("Post shared successful");
  //       })
  //       .catch(() => {
  //         console.log("Post shared failed");
  //       });
  //   } else {
  //     console.log("Sorry! Your browser does not support Web Share API");
  //   }
  // };

  return (
    <>
      <div
        className="container flex flex-col gap-6 rounded
          border-[0.25px] border-zinc-200/40 bg-gradient-to-br from-zinc-400/5 to-zinc-400/10 p-2 shadow
        hover:border-fuchsia-500 sm:grid sm:w-[36rem] sm:grid-flow-col sm:grid-cols-[auto_1fr] sm:p-4"
      >
        {/* Left */}
        <Avatar
          size="md"
          src={post.user.image ?? ""}
          name={post.user.name ?? ""}
          profileSlug={post.user.id ?? ""}
          addStyles="hidden place-self-center sm:block"
        />
        {post.categoryId === discussion?.id && (
          <div className="row-start-2 row-end-4 hidden place-self-center sm:block">
            <Vote postId={post.id} type="post" />
          </div>
        )}
        {/* Right */}
        <div className="flex w-full min-w-0 justify-between sm:col-start-2 sm:gap-0 sm:place-self-start">
          <div className="flex items-start gap-4 sm:gap-0">
            <Avatar
              size="md"
              src={post.user.image ?? ""}
              name={post.user.name ?? ""}
              profileSlug={post.user.id ?? ""}
              addStyles="block sm:hidden"
            />
            <div className="flex flex-col overflow-x-auto">
              {/* Name */}
              <span className="cursor-default font-semibold leading-5 text-zinc-200">
                {post.user.name}
              </span>
              {/* Date */}
              <div className="flex cursor-default gap-1 text-xs text-zinc-300">
                {formattedPostDate}
                {!isEqual(post.createdAt, post.updatedAt) && (
                  <>
                    <div className="group inline-flex hover:underline">
                      (edited
                      <div className="hidden group-hover:block group-hover:underline">
                        : {editedDate}
                      </div>
                      )
                    </div>
                  </>
                )}
              </div>
              <PostFlairList postId={post.id} />
            </div>
          </div>

          {/* Dots menu */}
          {(post.userId === userId ||
            userRole === "MOD" ||
            userRole === "ADMIN") && (
            <DotsMenu>
              <Menu.Item as="div">
                {post.userId === userId && (
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex w-full items-center justify-start gap-2 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                  >
                    <IconPencil />
                    <span className="text-sm">Edit</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item as="div">
                {(userRole === "MOD" ||
                  userRole === "ADMIN" ||
                  post.userId === userId) && (
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex w-full items-center justify-start gap-2 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                  >
                    <IconTrash />
                    <span className="text-sm">Delete</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item as="div">
                {post.userId !== userId && userRole === "USER" && (
                  <button
                    type="button"
                    className="flex w-full items-center justify-start gap-2 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
                  >
                    <IconPencil />
                    <span className="text-sm">Report</span>
                  </button>
                )}
              </Menu.Item>
            </DotsMenu>
          )}
        </div>

        {/* Title and Description */}
        <Link
          href={`/posts/${post.id}`}
          className="flex flex-col gap-2 overflow-hidden rounded p-2 hover:bg-zinc-600/20
            sm:col-start-2 sm:row-start-2 sm:row-end-3 "
        >
          <div className="max-w-[1rem] sm:max-w-none">
            <PostTitle title={post.title} />
          </div>
          <PostContent description={post.description} />
        </Link>

        {/* Bottom row */}
        {post.categoryId === discussion?.id && (
          <div className="col-start-2 row-start-3 flex justify-evenly">
            <div className="px-3 py-1 align-middle sm:hidden">
              <Vote postId={post.id} type="post" isFlexRow />
            </div>
            <Link
              href={`/posts/${post.id}`}
              className="rounded-full px-3 py-1 text-zinc-400 hover:bg-zinc-600/20 hover:text-zinc-100"
            >
              <CommentButton postId={post.id} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default PostCard;
