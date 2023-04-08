import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Colors,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMonthsInYear } from "utils/date";
import { trpc } from "utils/trpc";
import LoadingBlur from "components/LoadingBlur";

const NewUserReport = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    Tooltip,
    LineElement,
    PointElement,
    Title,
    Colors,
    Legend
  );

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "New users",
      },
      colors: {
        enabled: true,
      },
      responsive: true,
    },
  };

  const labels = useMonthsInYear().monthsInYear;

  const monthsFromStartOfYearToNow =
    useMonthsInYear().monthsFromStartOfYearToNow;

  const { data: users, isLoading } =
    trpc.user.getCountByMonthlyFilterJoinedDate.useQuery({
      monthsFromStartOfYearToNow: monthsFromStartOfYearToNow,
    });

  const data = {
    labels,
    datasets: [
      {
        label: "# of users",
        data: users,
      },
    ],
  };

  return (
    <div className="relative rounded border border-zinc-700 bg-zinc-800 p-4">
      {isLoading && <LoadingBlur />}
      <Line data={data} options={options} />
    </div>
  );
};

export default NewUserReport;
