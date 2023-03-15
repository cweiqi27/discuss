import { IconListSearch } from "@tabler/icons-react";

const EmptyQuery = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-8">
      <p className="cursor-default text-lg text-zinc-400">Start searching!</p>
      <IconListSearch className="text-lg text-zinc-400" />
    </div>
  );
};

export default EmptyQuery;
