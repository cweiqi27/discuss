type PostTitleProps = {
  title: string;
};

const PostTitle = (props: PostTitleProps) => {
  return (
    <h3 className="text-left text-2xl font-bold text-zinc-200">
      {props.title}
    </h3>
  );
};

export default PostTitle;
