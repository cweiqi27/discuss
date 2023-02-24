import { IconMessage } from "@tabler/icons-react";
import { trpc } from "utils/trpc";

type CommentButtonProps = {
  postId: string;
};

const CommentButton = ({ postId }: CommentButtonProps) => {
  const { data: count } = trpc.comment.getPostCommentCount.useQuery({
    postId: postId,
  });
  return (
    <div className="flex gap-2">
      <IconMessage />
      {count ? (
        count === 1 ? (
          <span>{count} comment</span>
        ) : (
          <span>{count} comments</span>
        )
      ) : (
        <span>Comment</span>
      )}
    </div>
  );
};

export default CommentButton;
