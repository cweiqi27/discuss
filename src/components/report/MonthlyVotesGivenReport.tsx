import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { useMonthsInYear } from "utils/date";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import { useMemo } from "react";
import LoadingBlur from "components/LoadingBlur";

type MonthlyVotesGivenReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const MonthlyVotesGivenReport = ({ user }: MonthlyVotesGivenReportProps) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    // LineElement,
    // PointElement,
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
        text: "Votes Given",
      },
      responsive: true,
    },
  };

  const labels = useMonthsInYear().monthsInYear;

  const monthsFromStartOfYearToNow =
    useMonthsInYear().monthsFromStartOfYearToNow;

  const { data: voteCount, isLoading } =
    trpc.vote.getGivenByUserMonthly.useQuery({
      id: user.id,
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
    });

  const data = {
    labels,
    datasets: [
      {
        label: "👍",
        data: voteCount ? voteCount.upvoteArr : 0,
        borderColor: "rgb(147 51 234)",
        backgroundColor: "rgb(168 85 247)",
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
      {isLoading && <LoadingBlur />}
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthlyVotesGivenReport;
