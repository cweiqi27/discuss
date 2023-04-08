import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { useMemo } from "react";
import { useMonthsInYear } from "utils/date";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import LoadingBlur from "components/LoadingBlur";
import {
  IconMoodNeutral,
  IconMoodSad,
  IconMoodSmile,
} from "@tabler/icons-react";
import { calcPercentageDiff } from "utils/general";

type VogueReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const VogueReport = ({ user }: VogueReportProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Vogue Performance",
      },
      responsive: true,
    },
  };

  const monthsFromStartOfYearToNow =
    useMonthsInYear().monthsFromStartOfYearToNow;
  const { data: voteCount, isLoading } =
    trpc.vote.getReceivedByUserMonthly.useQuery({
      id: user.id,
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
      isAccumulate: true,
    });

  const calculateVotes = () => {
    if (!voteCount) return null;
    const voteCountArr = [];
    let earliestVoteCount = 0;
    let accumulativeVoteCount = 0;

    for (let i = 0; i < voteCount.upvoteArr.length; i++) {
      const upvote = voteCount.upvoteArr[i] ?? 0;
      const downvote = voteCount.downvoteArr[i] ?? 0;

      if (i === 0) earliestVoteCount = upvote - downvote;
      voteCountArr.push(upvote - downvote);
      accumulativeVoteCount += upvote - downvote;
    }

    const voteDiffPercentage = calcPercentageDiff(
      earliestVoteCount,
      accumulativeVoteCount
    );

    console.log("DIFF" + voteDiffPercentage);

    return { voteCountArr, accumulativeVoteCount, voteDiffPercentage };
  };

  const calculatedVotes = useMemo(calculateVotes, [voteCount]);

  const labels = useMonthsInYear().monthsInYear;

  const data = {
    labels,
    datasets: [
      {
        label: "👍 to 👎 ratio",
        data: calculatedVotes?.voteCountArr,
        borderColor: "rgb(147 51 234)",
        backgroundColor: "rgb(168 85 247)",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative rounded border border-zinc-700 bg-zinc-800 p-4">
        <Line options={options} data={data} />
        {isLoading && <LoadingBlur />}
      </div>
      <div className="relative flex flex-col items-center rounded border border-zinc-700 bg-zinc-800 p-4">
        <p className="text-semibold text-zinc-400">Vogue score:</p>
        {calculatedVotes && calculatedVotes.accumulativeVoteCount > 0 ? (
          <span className="inline-flex items-center gap-2 text-lg font-semibold text-green-500">
            Positive <IconMoodSmile />
          </span>
        ) : calculatedVotes && calculatedVotes.accumulativeVoteCount === 0 ? (
          <span className="inline-flex items-center gap-2 text-lg font-semibold text-yellow-500">
            Neutral <IconMoodNeutral />
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-lg font-semibold text-red-500">
            Negative <IconMoodSad />{" "}
          </span>
        )}
      </div>
      <div className="relative flex flex-col items-center rounded border border-zinc-700 bg-zinc-800 p-4">
        <p className="text-semibold break-words text-zinc-400">
          Vogue difference since start of year:{" "}
        </p>
        {calculatedVotes && calculatedVotes.voteDiffPercentage >= 0 ? (
          <p className="text-lg font-semibold text-green-500">
            {calculatedVotes?.voteDiffPercentage}%
          </p>
        ) : (
          <p className="text-lg font-semibold text-red-500">
            {calculatedVotes?.voteDiffPercentage}%
          </p>
        )}
      </div>
    </div>
  );
};

export default VogueReport;
