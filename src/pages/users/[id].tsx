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
  const { data, isLoading, isError, isSuccess } = trpc.user.getById.useQuery({
    id,
  });
  const { data: sessionUserId } = trpc.auth.getUserId.useQuery();

  const joinedAtDate = useMemo(() => {
    return data && format(data.createdAt, "MMMM do, yyyy");
  }, [data]);

  return (
    <Layout type="PROFILE">
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 right-1/2 flex flex-col items-center justify-center gap-2 text-2xl text-zinc-300">
          <Spinner />
        </div>
      )}
      <section className="sm:w-[36rem]">
        {isError && <div>Error</div>}
        {data && (
          <>
            {/* Profile */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <Avatar
                  src={data.image ?? ""}
                  alt={data.name ?? ""}
                  size="lg"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-zinc-200">
                    {data.name}
                  </span>
                  <span className="text-sm font-semibold text-zinc-400">
                    {data.role}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div>
                  <span className="text-xs text-zinc-400">Joined at </span>
                  <span className="text-xs text-zinc-400">{joinedAtDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <ProfileBio
                user={data}
                isSessionUser={data.id === sessionUserId}
              />
              <PostHistoryList userId={data.id} size="md" />
            </div>
          </>
        )}
      </section>
      {/* <section className="col-start-1 row-start-2 flex flex-col gap-2">
        
      </section> */}
      <section className="col-start-2 col-end-3 row-start-2 hidden max-w-xs sm:block lg:w-72"></section>
    </Layout>
  );
};

export default UserPage;
