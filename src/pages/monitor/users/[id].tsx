import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Layout from "components/layout/Layout";
import { trpc } from "utils/trpc";
import { createContextInner } from "server/trpc/context";
import superjson from "superjson";
import { appRouter } from "server/trpc/router/_app";
import ProfileTitleCard from "components/profile/ProfileTitleCard";
import SearchBar from "components/algolia/SearchBar";
import VogueReport from "components/report/VogueReport";
import MonthlyVotesReceivedReport from "components/report/MonthlyVotesReceivedReport";
import AccumulativeVotesReceivedReport from "components/report/AccumulativeVotesReceivedReport";
import MonthlyVotesGivenReport from "components/report/MonthlyVotesGivenReport";
import AccumulativeVotesGivenReport from "components/report/AccumulativeVotesGivenReport";
import PostReport from "components/report/PostReport";
import PostFlairReport from "components/report/PostFLairReport";
import Link from "next/link";
import RecentActivities from "components/profile/RecentActivities";
import TopPostUserReport from "components/report/TopPostUserReport";
import Seo from "components/Seo";
import { DOMAIN_NAME } from "utils/constants";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });
  const id = context.params?.id as string;

  await ssg.user.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

const MonitorUserReportPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { id } = props;
  const {
    data: user,
    isLoading,
    isError,
  } = trpc.user.getById.useQuery({
    id,
  });

  return (
    <>
      <Seo
        title={user?.name}
        desc="Scuffed dark theme forum website for your scuffy needs."
        url={`${DOMAIN_NAME}/monitor`}
        type="website"
        noIndex
      />
      <Layout type="TIMELINE">
        <h1 className="text-3xl font-extrabold text-zinc-300">MONITOR</h1>
        <div className="row-start-2 flex gap-2">
          <Link
            href="/monitor"
            className="text-xl font-bold uppercase text-zinc-500 hover:text-zinc-400"
          >
            Overview
          </Link>
          <div className="cursor-default text-xl font-bold uppercase text-zinc-300">
            User
          </div>
        </div>
        <div className="row-start-3 flex flex-col gap-4 sm:min-w-[70vw]">
          <div className="flex">
            <SearchBar hitType="MONITOR" />
          </div>
          {user && (
            <div className="flex flex-col gap-2">
              <section className="mt-4">
                <ProfileTitleCard user={user} />
              </section>

              {/* Summary */}
              <h2 className="text-xl font-bold uppercase text-zinc-300">
                Summary
              </h2>
              <section className="flex flex-wrap justify-center gap-2">
                <VogueReport user={user} />
                <div className="flex flex-col gap-2">
                  <MonthlyVotesReceivedReport user={user} />
                  <AccumulativeVotesReceivedReport user={user} />
                </div>
                <div className="flex flex-col gap-2">
                  <MonthlyVotesGivenReport user={user} />
                  <AccumulativeVotesGivenReport user={user} />
                </div>
                <div className="flex flex-col flex-wrap justify-center gap-2">
                  <PostReport user={user} />
                  <PostFlairReport user={user} />
                </div>
              </section>

              {/* Posts and Activities */}
              <h2 className="text-xl font-bold uppercase text-zinc-300">
                Posts and Activities
              </h2>
              <section className="flex flex-wrap justify-center gap-2">
                <div className="relative flex max-w-sm flex-col gap-2 rounded border border-zinc-700 bg-zinc-800 p-4">
                  <h3 className="text-lg font-bold text-zinc-400">
                    Recent Activities:
                  </h3>
                  <RecentActivities userId={user.id} withoutTitle />
                </div>
                <div className="relative flex flex-col gap-2 rounded border border-zinc-700 bg-zinc-800 p-4">
                  <TopPostUserReport user={user} type="COMMENTS" />
                </div>
              </section>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default MonitorUserReportPage;
