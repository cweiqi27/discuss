import { IconAlertTriangleFilled } from "@tabler/icons-react";
import Layout from "components/layout/Layout";
import AccumulativePostReport from "components/report/AccumulativePostReport";
import AccumulativeUserReport from "components/report/AccumulativeUserReport";
import NewUserReport from "components/report/NewUserReport";
import PostFlairReport from "components/report/PostFLairReport";
import Spinner from "components/Spinner";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MostCommentedPostReport from "components/report/MostCommentedPostReport";
import UsersTable from "components/UsersTable";
import TopPostReport from "components/report/TopPostReport";
import Seo from "components/Seo";
import { DOMAIN_NAME } from "utils/constants";

const MonitorPage: NextPage = (props) => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <Layout type="TIMELINE">
        <div className="grid h-[50vh] place-items-center">
          <Spinner />
        </div>
      </Layout>
    );

  if (
    (session && session.user?.role === "GUEST") ||
    (session && session.user?.role == "USER") ||
    status === "unauthenticated"
  )
    return (
      <>
        <Seo
          title="Discuss"
          desc="Scuffed dark theme forum website for your scuffy needs."
          url={`${DOMAIN_NAME}/monitor`}
          type="website"
          noIndex
        />
        <Layout type="TIMELINE">
          <div className="flex h-[50vh] flex-col justify-center gap-3">
            <IconAlertTriangleFilled className="h-24 w-24 self-center text-rose-700" />
            <h1 className="text-3xl font-bold text-zinc-300">
              You are not allowed to view this page.
            </h1>
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-400 hover:underline"
            >
              Go back to home page
            </Link>
          </div>
        </Layout>
      </>
    );

  return (
    <>
      <Seo
        title="Monitor"
        desc="Scuffed dark theme forum website for your scuffy needs."
        url={`${DOMAIN_NAME}/monitor`}
        type="website"
        noIndex
      />
      <Layout type="TIMELINE">
        <h1 className="text-3xl font-extrabold text-zinc-300">MONITOR</h1>
        <div className="row-start-2 flex gap-2">
          <div className="cursor-default text-xl font-bold uppercase text-zinc-300">
            Overview
          </div>
        </div>
        <div className="row-start-3 sm:min-w-[90vw]">
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex flex-col gap-2">
              <AccumulativeUserReport />
              <NewUserReport />
            </div>
            <div className="flex flex-col gap-2">
              <AccumulativePostReport />
              <PostFlairReport />
            </div>
          </div>
        </div>
        <div className="row-start-4 flex flex-wrap justify-center gap-2">
          <MostCommentedPostReport />
          <div className="relative flex max-w-sm flex-col gap-2 rounded border border-zinc-700 bg-zinc-800 p-4">
            <TopPostReport type="COMMENTS" />
          </div>
        </div>
        <div className="row-start-5">
          <h2 className="mt-8 border-t-2 border-zinc-800 py-4 text-2xl font-bold uppercase text-zinc-200">
            Users
          </h2>
          <UsersTable />
        </div>
      </Layout>
    </>
  );
};

export default MonitorPage;
