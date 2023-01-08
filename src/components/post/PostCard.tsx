import Card from "components/layout/Card";
import Link from "next/link";
import PostContent from "./PostContent";
import PostFlair from "./PostFlair";
import PostLoadingSkeleton from "./PostLoadingSkeleton";
import PostTitle from "./PostTitle";
import PostVote from "./PostVote";

type PostCardProps = {
  title: string;
  description?: string;
  isLoading?: boolean;
};

const PostCard = (props: PostCardProps) => {
  return (
    <>
      {props.isLoading ? (
        <PostLoadingSkeleton />
      ) : (
        <Card
          isFlexRow
          addStyles="background-blur gap-8 mb-2 w-full border-[0.25px] border-zinc-200/40 bg-gradient-to-br from-zinc-50/5 to-zinc-50/10 shadow"
        >
          {/* Left */}
          <div className="flex flex-col justify-between gap-4">
            <span className="rounded-full bg-pink-400 p-12"></span>
            <PostVote />
          </div>
          {/* Right */}
          <div className="flex flex-col items-start justify-between gap-2">
            <div className="flex gap-4">
              <PostFlair flair="Fun" flairHref="/" />
            </div>
            <Link href="/">
              <div className="flex flex-col items-start justify-center gap-2">
                <PostTitle title={props.title} />
                <PostContent description={props.description} />
              </div>
            </Link>
          </div>
          <div>bottom</div>
        </Card>
      )}
    </>
  );
};

export default PostCard;
