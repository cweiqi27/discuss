import { IconMessage } from "@tabler/icons";
import Avatar from "components/avatar/Avatar";
import Card from "components/layout/Card";
import Link from "next/link";
import type { RouterOutputs } from "utils/trpc";
import PostContent from "./PostContent";
import PostFlair from "./PostFlair";
import PostLoadingSkeleton from "./PostLoadingSkeleton";
import PostTitle from "./PostTitle";
import PostVote from "./PostVote";

type PostCardProps = {
  post: RouterOutputs["post"]["getPostInfinite"]["posts"][number];
  isLoading?: boolean;
};

const PostCard = (props: PostCardProps) => {
  return (
    <>
      {props.isLoading ? (
        <PostLoadingSkeleton />
      ) : (
        <Link
          href="/"
          className="background-blur mb-2 grid auto-cols-fr grid-flow-row grid-cols-5 grid-rows-4 place-items-baseline gap-8 rounded border-[0.25px] border-zinc-200/40 bg-gradient-to-br from-zinc-400/5 to-zinc-400/10 p-4 shadow
        hover:border-fuchsia-500 sm:grid-flow-col sm:grid-cols-10 sm:grid-rows-3"
        >
          {/* Left */}
          <Avatar
            src={props.post.user.image ?? ""}
            alt={props.post.user.name ?? ""}
            profileLink="/"
            addStyles="order-1 place-self-start sm:place-self-center"
          />
          <div className="order-4 place-self-center sm:order-2 sm:row-span-2">
            <PostVote />
          </div>
          {/* Right */}
          <div className="order-2 col-span-4 place-self-start sm:order-3 sm:col-span-9">
            <PostFlair flair="Fun" flairHref="/" />
          </div>
          <div className="order-3 col-span-5 row-span-2 sm:order-4 sm:col-span-9 sm:row-span-1">
            <div className="flex flex-col items-start justify-center gap-2">
              <PostTitle title={props.post.title} />
              <PostContent description={props.post.description} />
            </div>
          </div>
          <div className="order-5 col-span-4 sm:order-4 sm:col-span-9">
            <div className="flex w-full justify-center gap-2">
              <Link
                href="/api"
                className="flex-1 rounded-full px-4 py-2 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
              >
                <div className="flex gap-2">
                  <IconMessage />
                  Comment
                </div>
              </Link>
              <Link
                href="/"
                className="flex-1 rounded-full px-4 py-2 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
              >
                <div className="flex gap-2">
                  <IconMessage />
                  Comment
                </div>
              </Link>
              <Link
                href="/"
                className="flex-1 rounded-full px-4 py-2 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-100"
              >
                <div className="flex gap-2">
                  <IconMessage />
                  Comment
                </div>
              </Link>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default PostCard;
