type PostContentProps = {
  content?: string;
};

const PostContent = (props: PostContentProps) => {
  return <p className="text-justify text-zinc-200">{props.content}</p>;
};

export default PostContent;
