import { useMemo } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";

type VogueProps = {
  user: RouterOutputs["user"]["getById"];
  className?: string;
};

const Vogue = ({ user, className }: VogueProps) => {
  const { data: votesReceived } = trpc.vote.getReceivedByUserAll.useQuery({
    id: user.id,
  });

  const calculateVogue = () => {
    if (!votesReceived) return null;
    return votesReceived.upvotes - votesReceived.downvotes;
  };

  const vogue = useMemo(calculateVogue, [votesReceived]);

  return <span className={className}>{vogue}</span>;
};

("");
export default Vogue;
