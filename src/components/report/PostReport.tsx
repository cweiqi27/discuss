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

type PostReportProps = {
  user: RouterOutputs["user"]["getById"];
};

const PostReport = ({ user }: PostReportProps) => {
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
        text: "Posts and Comments Published",
      },
      responsive: true,
    },
  };

  const labels = useMonthsInYear().monthsInYear;

  const monthsFromStartOfYearToNow =
    useMonthsInYear().monthsFromStartOfYearToNow;

  const { data: postCount, isLoading: postIsLoading } =
    trpc.post.getCountByUserMonthly.useQuery({
      id: user.id,
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
    });

  const { data: commentCount, isLoading: commentIsLoading } =
    trpc.comment.getCountByUserMonthly.useQuery({
      id: user.id,
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
    });

  const data = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: postCount ?? 0,
        borderColor: "rgb(147 51 234)",
        backgroundColor: "rgb(168 85 247)",
      },
      {
        label: "Comments",
        data: commentCount ?? 0,
        borderColor: "rgb(20 184 166)",
        backgroundColor: "rgb(13 148 136)",
      },
    ],
  };

  return (
    <div className="relative rounded border border-zinc-700 bg-zinc-800 p-4">
      {(postIsLoading || commentIsLoading) && <LoadingBlur />}
      <Bar options={options} data={data} />
    </div>
  );
};

export default PostReport;
