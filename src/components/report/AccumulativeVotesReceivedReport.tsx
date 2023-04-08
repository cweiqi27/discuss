import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Colors,
  Tooltip,
  Legend,
} from "chart.js";
import { useMonthsInYear } from "utils/date";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import { useMemo } from "react";
import LoadingBlur from "components/LoadingBlur";

type AccumulativeVotesReceivedReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const AccumulativeVotesReceivedReport = ({
  user,
}: AccumulativeVotesReceivedReportProps) => {
  ChartJS.register(ArcElement, Title, Colors, Tooltip, Legend);

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Overall Votes Received",
      },
      responsive: true,
      colors: {
        enabled: true,
        forceOverride: true,
      },
    },
  };

  const { data: vote, isLoading } = trpc.vote.getReceivedByUserAll.useQuery({
    id: user.id,
  });

  const setVoteData = () => {
    const labels: string[] = [];
    const dataArr: number[] = [];

    if (!vote) return;

    labels.push("👍");
    dataArr.push(vote.upvotes);
    labels.push("👎");
    dataArr.push(vote.downvotes);
    return { labels, dataArr };
  };

  const voteData = useMemo(setVoteData, [vote]);

  const data = {
    labels: voteData?.labels,
    datasets: [
      {
        label: "# of votes",
        data: voteData?.dataArr,
      },
    ],
  };

  return (
    <div className="relative rounded border border-zinc-700 bg-zinc-800 p-4">
      {isLoading && <LoadingBlur />}
      <Pie options={options} data={data} />
    </div>
  );
};

export default AccumulativeVotesReceivedReport;
