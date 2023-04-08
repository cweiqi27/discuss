import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
} from "chart.js";
import { useMemo } from "react";
import { useMonthsInYear } from "utils/date";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import LoadingBlur from "components/LoadingBlur";

type MonthlyVotesReceivedReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const MonthlyVotesReceivedReport = ({ user }: MonthlyVotesReceivedReportProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
        text: "Votes Received",
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
    });

  const labels = useMonthsInYear().monthsInYear;

  const data = {
    labels,
    datasets: [
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
    <div className="relative rounded border border-zinc-700 bg-zinc-800 p-4">
      <Bar options={options} data={data} />
      {isLoading && <LoadingBlur />}
    </div>
  );
};

export default MonthlyVotesReceivedReport;
