import LoadingBlur from "components/LoadingBlur";
import { trpc } from "utils/trpc";

const AccumulativePostReport = () => {
  const { data: postCount, isLoading } = trpc.post.getCountAll.useQuery();

  return (
    <div className="relative flex flex-col items-center gap-4 rounded border border-zinc-700 bg-zinc-800 p-4">
      {isLoading && <LoadingBlur />}
      <h2 className="cursor-default text-xs font-bold text-gray-500">
        All time posts:
      </h2>
      <p className="text-xl font-semibold text-zinc-400">{postCount}</p>
    </div>
  );
};

export default AccumulativePostReport;
