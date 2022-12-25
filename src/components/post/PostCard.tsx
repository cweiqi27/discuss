import Card from "components/layout/Card";
import PostContent from "./PostContent";
import PostTitle from "./PostTitle";
import PostVote from "./PostVote";

type PostCardProps = {
  children: React.ReactNode;
  title: string;
  content?: string;
};

const PostCard = (props: PostCardProps) => {
  return (
    <Card
      isFlexRow
      addStyles="background-blur gap-8 mb-2 w-full border-[0.25px] border-zinc-200/40 bg-gradient-to-br from-zinc-800/40 to-zinc-800/50 shadow"
    >
      <div className="flex flex-col justify-between gap-4">
        <span className="rounded-full bg-pink-400 p-12"></span>
        <PostVote />
      </div>
      <div className="flex flex-col items-start justify-between gap-2">
        <div>flair</div>
        <button>
          <div className="flex flex-col items-start justify-center gap-2">
            <PostTitle title={props.title} />
            <PostContent content={props.content} />
          </div>
        </button>
        <div>bottom</div>
      </div>
    </Card>
  );
};

export default PostCard;
