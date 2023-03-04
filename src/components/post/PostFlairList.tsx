import React from "react";
import { trpc } from "utils/trpc";
import PostFlair from "./PostFlair";

type PostFlairListProps = {
  postId: string;
  flexWrap?: boolean;
};

const PostFlairList = (props: PostFlairListProps) => {
  const { data: postFlairs } = trpc.post.getFlairsByPost.useQuery({
    postId: props.postId,
  });
  return postFlairs ? (
    <div
      className={`mt-2 flex gap-1 overflow-x-auto ${
        props.flexWrap ? "flex-wrap" : "flex-nowrap"
      } `}
    >
      {postFlairs.flairs.map((flair) => (
        <PostFlair key={flair.flairId} flair={flair} />
      ))}
    </div>
  ) : (
    <></>
  );
};

export default PostFlairList;
