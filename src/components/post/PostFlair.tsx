import Link from "next/link";
import type { RouterOutputs } from "utils/trpc";

type PostFlairProps = {
  flair: RouterOutputs["post"]["getFlairsByPost"]["flairs"][number];
  addStyles?: string;
};

const PostFlair = (props: PostFlairProps) => {
  return (
    <Link href="/">
      <div
        className={`${"cursor-pointer rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-white/20"} ${
          props.addStyles
        } `}
      >
        {props.flair.flair.flairName}
      </div>
    </Link>
  );
};

export default PostFlair;
