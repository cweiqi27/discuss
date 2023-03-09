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
import { getMonthsInYear } from "utils/date";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import { useMemo } from "react";
import LoadingBlur from "components/LoadingBlur";

type VotesGivenReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const VotesGivenReport = ({ user }: VotesGivenReportProps) => {
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
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "User performance",
      },
      responsive: true,
    },
  };

  const labels = getMonthsInYear().monthsInYear;

  const monthsFromStartOfYearToNow =
    getMonthsInYear().monthsFromStartOfYearToNow;

  const { data: voteCount, isLoading } =
    trpc.vote.getMonthlyGivenVoteCountByUserId.useQuery({
      id: user.id,
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
    });

  const data = {
    labels,
    datasets: [
      {
        label: "Upvotes",
        data: voteCount ? voteCount.upvoteArr : 0,
        borderColor: "rgb(147 51 234)",
        backgroundColor: "rgb(168 85 247)",
      },
      {
        label: "Downvotes",
        data: voteCount ? voteCount.downvoteArr : 0,
        borderColor: "rgb(225 29 72)",
        backgroundColor: "rgb(244 63 94)",
      },
    ],
  };

  return (
    <div className="relative w-full">
      {isLoading && <LoadingBlur />}
      <Bar options={options} data={data} />
    </div>
  );
};

export default VotesGivenReport;
