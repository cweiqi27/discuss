type PostTitleProps = {
  title: string;
};

const PostTitle = (props: PostTitleProps) => {
  return (
    <p className="text-2xl font-bold text-zinc-200 sm:truncate">
      {props.title}
    </p>
  );
};

export default PostTitle;
