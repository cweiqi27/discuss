import { IconThumbDown, IconThumbUp } from "@tabler/icons";

type PostVoteProps = {
  votes?: number;
  isFlexRow?: boolean;
};

const voteContainerStyles = "flex";

const PostVote = (props: PostVoteProps) => {
  return (
    <div
      className={`${voteContainerStyles} ${
        props.isFlexRow ? "flex-row" : "flex-col items-center"
      }`}
    >
      <button>
        <IconThumbUp
          className="text-zinc-200 transition-colors hover:cursor-pointer hover:fill-teal-400/40"
          stroke={1.5}
        />
      </button>
      <div className="text-zinc-200">{props.votes}</div>
      <button>
        <IconThumbDown
          className="text-zinc-200 transition-colors hover:cursor-pointer hover:fill-rose-400/40"
          stroke={1.5}
        />
      </button>
    </div>
  );
};

export default PostVote;
