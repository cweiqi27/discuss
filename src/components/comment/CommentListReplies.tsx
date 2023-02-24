import React from "react";
import { useSortStore } from "store/sortStore";
import { trpc } from "utils/trpc";
import CommentCard from "./CommentCard";
import CommentLoadingSkeleton from "./CommentLoadingSkeleton";

type CommentListRepliesProps = {
  postId: string;
  parentId: string;
};

const CommentListReplies = ({ postId, parentId }: CommentListRepliesProps) => {
  const { data, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } =
    trpc.comment.getAllCursor.useInfiniteQuery(
      {
        limit: 5,
        postId: postId,
        sortBy: "timeAsc",
        parentId: parentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const handleClickViewMore = () => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <>
      {comments.map((comment) => {
        return <CommentCard key={comment.id} comment={comment} />;
      })}

      {isFetching && <CommentLoadingSkeleton />}

      {hasNextPage && <button onClick={handleClickViewMore}>View more</button>}

      {!hasNextPage && <></>}
    </>
  );
};

export default CommentListReplies;
