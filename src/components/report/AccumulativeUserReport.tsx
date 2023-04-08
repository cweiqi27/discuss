import LoadingBlur from "components/LoadingBlur";
import { trpc } from "utils/trpc";

const AccumulativeUserReport = () => {
  const { data: totalUsers, isLoading } = trpc.user.getCountAllUsers.useQuery();
  const { data: activeUsers, isLoading: activeUsersIsLoading } =
    trpc.user.getCountActiveUsers.useQuery();

  return (
    <>
      <div className="relative flex flex-col items-center gap-4 rounded border border-zinc-700 bg-zinc-800 p-4">
        {isLoading && <LoadingBlur />}
        <h2 className="cursor-default text-xs font-bold text-gray-500">
          Total users (inc. removed):
        </h2>
        <p className="text-xl font-semibold text-zinc-400">{totalUsers}</p>
      </div>
      <div className="relative flex flex-col items-center gap-4 rounded border border-zinc-700 bg-zinc-800 p-4">
        {activeUsersIsLoading && <LoadingBlur />}
        <h2 className="cursor-default text-xs font-bold text-gray-500">
          Active users:
        </h2>
        <p className="text-xl font-semibold text-zinc-400">{activeUsers}</p>
      </div>
    </>
  );
};

export default AccumulativeUserReport;
