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
import Avatar from "components/avatar/Avatar";
import { format } from "date-fns";
import PostHistoryList from "components/history/PostHistory";
import ProfileBio from "components/profile/ProfileBio";
import { useMemo } from "react";
import Spinner from "components/Spinner";
import ProfileTitleCard from "components/profile/ProfileTitleCard";
import Contacts from "components/profile/Contacts";
import Info from "components/profile/Info";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });
  const id = context.params?.id as string;

  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

const UserPage = (
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
  const { data: sessionUserId } = trpc.auth.getUserId.useQuery();

  return (
    <Layout type="PROFILE">
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 right-1/2 flex flex-col items-center justify-center gap-2 text-2xl text-zinc-300">
          <Spinner />
        </div>
      )}
      {isError && <div>Error</div>}
      {user && (
        <>
          <section className="sm:w-[36rem]">
            <>
              {/* Profile */}
              <ProfileTitleCard user={user} />
              <div className="mt-4 flex flex-col gap-2">
                <PostHistoryList userId={user.id} size="md" />
              </div>
            </>
          </section>
          <section className="col-start-2 col-end-3 hidden max-w-xs gap-2 sm:flex sm:flex-col lg:w-72">
            <ProfileBio user={user} isSessionUser={user.id === sessionUserId} />
            <Contacts user={user} />
            <Info user={user} />
          </section>
        </>
      )}
    </Layout>
  );
};

export default UserPage;
