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

type AccumulativeVotesGivenReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const AccumulativeVotesGivenReport = ({
  user,
}: AccumulativeVotesGivenReportProps) => {
  ChartJS.register(ArcElement, Title, Colors, Tooltip, Legend);

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Overall Votes Given",
      },
      responsive: true,
      colors: {
        enabled: true,
        forceOverride: true,
      },
    },
  };

  const { data: vote, isLoading } = trpc.vote.getGivenByUserAll.useQuery({
    id: user.id,
  });

  const setVoteData = () => {
    const labels: string[] = [];
    const dataArr: number[] = [];

    if (!vote) return;

    vote.upvoteArr.map((upvote) => {
      labels.push("👍");
      dataArr.push(upvote);
    });

    vote.downvoteArr.map((downvote) => {
      labels.push("👎");
      dataArr.push(downvote);
    });

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

export default AccumulativeVotesGivenReport;
