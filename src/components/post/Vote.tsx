import type { VoteType } from "@prisma/client";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "utils/trpc";

type VoteProps = {
  type: "post" | "comment";
  postId: string;
  commentPostId?: string;
  isFlexRow?: boolean;
};
const Vote = ({ type, postId, commentPostId, isFlexRow }: VoteProps) => {
  const { data: sessionData } = useSession();

  // GET
  const { data: userId } = trpc.auth.getUserId.useQuery();
  const { data: post } = trpc.post.getById.useQuery({
    id: commentPostId ? commentPostId : postId,
  });
  const {
    data: votes,
    isLoading: postVoteIsLoading,
    isError: postVoteIsError,
  } = trpc.vote.getById.useQuery({
    id: postId,
    type: type,
  });
  const { data: voteByUser } = trpc.vote.getBySessionUser.useQuery({
    id: postId,
    type: type,
  });
  const voteByUserType = voteByUser?.voteType;

  // POST
  const utils = trpc.useContext();
  const createVote = trpc.vote.create.useMutation({
    async onMutate({ voteType }) {
      await utils.vote.getById.cancel();
      await utils.vote.getBySessionUser.cancel();

      const prevPostVoteData = utils.vote.getById.getData();
      const prevPostVoteByUserData = utils.vote.getBySessionUser.getData();

      utils.vote.getById.setData({ id: postId, type: type }, (old) =>
        old && voteType === "UPVOTE"
          ? { ...old, upvotes: old.upvotes + 1, voteCount: old.voteCount + 1 }
          : old && voteType === "DOWNVOTE"
          ? {
              ...old,
              downvotes: old.downvotes + 1,
              voteCount: old.voteCount - 1,
            }
          : old
      );

      utils.vote.getBySessionUser.setData({ id: postId, type: type }, (old) =>
        old ? { ...old, voteType: voteType } : old
      );

      return { prevPostVoteData, prevPostVoteByUserData };
    },
    onError(err, { voteType }, ctx) {
      utils.vote.getById.setData(
        { id: postId, type: type },
        ctx?.prevPostVoteData
      );
      utils.vote.getBySessionUser.setData(
        { id: postId, type: type },
        ctx?.prevPostVoteByUserData
      );
    },
    onSettled: () => {
      utils.vote.getById.invalidate();
      utils.vote.getBySessionUser.invalidate();
    },
  });

  const updateVote = trpc.vote.update.useMutation({
    async onMutate({ voteType, type: postType, updateActionType }) {
      type computeVoteTypes = {
        oldVote: number;
        updateActionType: typeof updateActionType;
        postType: typeof postType;
        voteType: typeof voteType;
        fieldType: "upvotes" | "downvotes" | "voteCount";
      };

      const computeVote = ({
        oldVote: oldCount,
        updateActionType,
        voteType,
        fieldType,
      }: computeVoteTypes) => {
        if (updateActionType === "removeVote") {
          if (voteType === "UPVOTE") {
            switch (fieldType) {
              case "upvotes":
                return oldCount - 1;
              case "downvotes":
                return oldCount;
              case "voteCount":
                return oldCount - 1;
            }
          } else {
            switch (fieldType) {
              case "upvotes":
                return oldCount;
              case "downvotes":
                return oldCount + 1;
              case "voteCount":
                return oldCount + 1;
            }
          }
          // "changeVote"
        } else {
          if (voteType === "UPVOTE") {
            switch (fieldType) {
              case "upvotes":
                return oldCount + 1;
              case "downvotes":
                return oldCount - 1;
              case "voteCount":
                return oldCount + 2;
              default:
                return oldCount;
            }
          } else {
            switch (fieldType) {
              case "upvotes":
                return oldCount - 1;
              case "downvotes":
                return oldCount + 1;
              case "voteCount":
                return oldCount - 2;
              default:
                return oldCount;
            }
          }
        }
      };

      await utils.vote.getById.cancel();
      await utils.vote.getBySessionUser.cancel();

      const prevPostVoteData = utils.vote.getById.getData();
      const prevPostVoteByUserData = utils.vote.getBySessionUser.getData();

      utils.vote.getById.setData({ id: postId, type: type }, (old) =>
        old
          ? {
              ...old,
              upvotes: computeVote({
                oldVote: old.upvotes,
                updateActionType: updateActionType,
                voteType: voteType,
                fieldType: "upvotes",
                postType: postType,
              }),
              downvotes: computeVote({
                oldVote: old.downvotes,
                updateActionType: updateActionType,
                voteType: voteType,
                fieldType: "downvotes",
                postType: postType,
              }),
              voteCount: computeVote({
                oldVote: old.voteCount,
                updateActionType: updateActionType,
                voteType: voteType,
                fieldType: "voteCount",
                postType: postType,
              }),
            }
          : old
      );
      utils.vote.getBySessionUser.setData({ id: postId, type: type }, (old) =>
        old ? { ...old, voteType: voteType } : old
      );

      return { prevPostVoteData, prevPostVoteByUserData };
    },
    onError(err, { voteType, type }, ctx) {
      utils.vote.getById.setData(
        { id: postId, type: type },
        ctx?.prevPostVoteData
      );
      utils.vote.getBySessionUser.setData(
        { id: postId, type: type },
        ctx?.prevPostVoteByUserData
      );
    },
    onSettled: () => {
      utils.vote.getById.invalidate();
      utils.vote.getBySessionUser.invalidate();
    },
  });

  const createNotification = trpc.notification.create.useMutation();

  const handleVote = (voteType: VoteType) => {
    if (voteByUser) {
      if (voteByUserType === voteType) {
        updateVote.mutate({
          id: postId,
          voteType: voteType,
          updateActionType: "removeVote",
          type: type,
        });
      } else {
        updateVote.mutate({
          id: postId,
          voteType: voteType,
          updateActionType: "changeVote",
          type: type,
        });
      }
    } else {
      createVote.mutate({
        voteType: voteType,
        id: postId,
        type: type,
      });

      if (
        post &&
        post.post !== null &&
        voteType === "UPVOTE" &&
        post.post.userId != userId
      ) {
        createNotification.mutate({
          id: type === "post" ? postId : commentPostId ?? "",
          commentId: type === "comment" ? postId : null,
          notificationTypeId: type === "post" ? 1 : 3,
        });
      }
    }
  };

  return (
    <div
      className={`flex items-center gap-1 ${
        isFlexRow ? "sm:flex-row" : "sm:flex-col"
      }`}
    >
      <IconThumbUp
        className={`text-zinc-200 transition-colors hover:cursor-pointer ${
          voteByUserType === "UPVOTE"
            ? "fill-teal-500"
            : "hover:fill-teal-400/40"
        }`}
        stroke={1.5}
        onClick={
          sessionData ? () => handleVote("UPVOTE") : () => signIn("google")
        }
      />
      <span
        className={`cursor-default text-sm font-bold ${
          voteByUserType === "UPVOTE"
            ? "text-teal-500"
            : voteByUserType === "DOWNVOTE"
            ? "text-rose-500"
            : "text-zinc-200"
        }`}
      >
        {postVoteIsLoading || postVoteIsError ? "Vote" : votes?.voteCount}
      </span>
      <IconThumbDown
        className={`text-zinc-200 transition-colors hover:cursor-pointer ${
          voteByUserType === "DOWNVOTE"
            ? "fill-rose-500"
            : "hover:fill-rose-400/40"
        }`}
        stroke={1.5}
        onClick={
          sessionData ? () => handleVote("DOWNVOTE") : () => signIn("google")
        }
      />
    </div>
  );
};

export default Vote;
