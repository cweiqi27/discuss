import React from "react";
import { trpc } from "utils/trpc";
import StickyCard from "./StickyCard";

type Props = {
  children?: React.ReactNode;
};

const StickyList = (props: Props) => {
  const { data: sticky } = trpc.post.getSticky.useQuery();

  return (
    <div className="sticky top-0">
      <div className="h-screen space-y-2 overflow-y-auto">
        {sticky?.map((sticky) => {
          return (
            <StickyCard key={sticky.id} text={sticky.title} color="purple" />
          );
        })}
      </div>
    </div>
  );
};

export default StickyList;
