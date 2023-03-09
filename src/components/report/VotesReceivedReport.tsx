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
import { getMonthsInYear } from "utils/date";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import LoadingBlur from "components/LoadingBlur";

type VotesReceivedReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const VotesReceivedReport = ({ user }: VotesReceivedReportProps) => {
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
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: user.name ?? "",
      },
      responsive: true,
    },
  };

  const monthsFromStartOfYearToNow =
    getMonthsInYear().monthsFromStartOfYearToNow;
  const { data: voteCount, isLoading } =
    trpc.vote.getMonthlyVoteByUserId.useQuery({
      id: user.id,
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
    });

  const calculateVotes = () => {
    if (!voteCount) return null;
    const voteCountArr = [];
    for (let i = 0; i < voteCount.upvoteArr.length; i++) {
      const upvote = voteCount.upvoteArr[i] ?? 0;
      const downvote = voteCount.downvoteArr[i] ?? 0;
      voteCountArr.push(upvote - downvote);
    }
    return voteCountArr;
  };

  const calculatedVotes = useMemo(calculateVotes, [voteCount]);

  const labels = getMonthsInYear().monthsInYear;

  const data = {
    labels,
    datasets: [
      {
        label: "👍 to 👎 ratio",
        data: calculatedVotes,
        borderColor: "rgb(147 51 234)",
        backgroundColor: "rgb(168 85 247)",
      },
      {
        label: "👍",
        data: voteCount ? voteCount.upvoteArr : 0,
        borderColor: "rgb(20 184 166)",
        backgroundColor: "rgb(13 148 136)",
      },
      {
        label: "👎",
        data: voteCount ? voteCount.downvoteArr : 0,
        borderColor: "rgb(225 29 72)",
        backgroundColor: "rgb(244 63 94)",
      },
    ],
  };

  return (
    <div className="relative">
      <Line options={options} data={data} />
      {isLoading && <LoadingBlur />}
    </div>
  );
};

export default VotesReceivedReport;
