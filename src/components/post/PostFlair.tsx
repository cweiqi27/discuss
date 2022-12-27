import Link from "next/link";

type PostFlairProps = {
  flair: string;
  flairHref: string;
  addStyles?: string;
};

const PostFlair = (props: PostFlairProps) => {
  return (
    <Link href={props.flairHref}>
      <div
        className={`${"cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/20"} ${
          props.addStyles
        } `}
      >
        {props.flair}
      </div>
    </Link>
  );
};

export default PostFlair;
