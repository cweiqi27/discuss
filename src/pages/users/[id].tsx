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
import PostHistoryList from "components/history/PostHistory";
import ProfileBio from "components/profile/ProfileBio";
import Spinner from "components/Spinner";
import ProfileTitleCard from "components/profile/ProfileTitleCard";
import Contacts from "components/profile/Contacts";
import Info from "components/profile/Info";
import { useSession } from "next-auth/react";
import SecurityCard from "components/profile/SecurityCard";
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
  const { data: sessionData } = useSession();
  const sessionUserId = sessionData?.user?.id;
  const sessionUserRole = sessionData?.user?.role;

  return (
    <>
      <Seo
        title={user ? user.name : "Discuss"}
        desc="Scuffed dark theme forum website for your scuffy needs."
        url={`${DOMAIN_NAME}/users/${id}`}
        type="profile"
      />
      <Layout type="DOUBLE">
        {isLoading && (
          <div className="fixed top-1/2 left-1/2 right-1/2 flex flex-col items-center justify-center gap-2 text-2xl text-zinc-300">
            <Spinner />
          </div>
        )}
        {isError && <div>Error</div>}
        {user && (
          <>
            <section className="sm:w-[36rem]">
              <div className="flex flex-col gap-2">
                {/* Profile */}
                <ProfileTitleCard user={user} />
                <div className="mt-4 flex flex-col gap-2">
                  <PostHistoryList userId={user.id} size="md" />
                </div>
                {(user.id === sessionUserId || sessionUserRole === "ADMIN") &&
                  user.status !== "REMOVED" && <SecurityCard user={user} />}
              </div>
            </section>
            <section className="row-start-2 mt-4 flex w-full flex-col gap-2 sm:col-start-2 sm:row-start-1 lg:w-72">
              <ProfileBio
                user={user}
                isSessionUser={user.id === sessionUserId}
              />
              <Contacts user={user} />
              <Info user={user} />
            </section>
          </>
        )}
      </Layout>
    </>
  );
};

export default UserPage;
