type PostContentProps = {
  description?: string | null;
};

const PostContent = (props: PostContentProps) => {
  return (
    <p className="text-justify text-zinc-200 sm:truncate">
      {props.description}
    </p>
  );
};

export default PostContent;
