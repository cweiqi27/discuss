import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Colors,
  Tooltip,
  Legend,
} from "chart.js";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import LoadingBlur from "components/LoadingBlur";
import { useMemo } from "react";

type PostFlairReportProps = {
  user?: RouterOutputs["user"]["getById"];
};

const PostFlairReport = ({ user }: PostFlairReportProps) => {
  ChartJS.register(ArcElement, Tooltip, Title, Colors, Legend);

  const options = {
    plugins: {
      legend: {
        position: "left" as const,
      },
      title: {
        display: true,
        text: "Flairs of Published Posts",
      },
      colors: {
        enabled: true,
        forceOverride: true,
      },
      responsive: true,
    },
  };

  const { data: flairPosts, isLoading } = user
    ? trpc.post.getAllCountByUserFilterFlair.useQuery({
        id: user.id,
      })
    : trpc.post.getAllCountFilterFlair.useQuery();

  const setFlairPostData = () => {
    const labels: string[] = [];
    const dataArr: number[] = [];

    if (!flairPosts) return;

    flairPosts.map((flairPost) => {
      if (flairPost.postCount > 0) {
        labels.push(flairPost.flairName);
        dataArr.push(flairPost.postCount);
      }
    });

    return { labels, dataArr };
  };

  const flairPostData = useMemo(setFlairPostData, [flairPosts]);

  const data = {
    labels: flairPostData?.labels,
    datasets: [
      {
        label: "# of posts",
        data: flairPostData?.dataArr,
      },
    ],
  };

  return (
    <div className="relative rounded border border-zinc-700 bg-zinc-800 p-4">
      {isLoading && <LoadingBlur />}
      <Pie data={data} options={options} />
    </div>
  );
};

export default PostFlairReport;
