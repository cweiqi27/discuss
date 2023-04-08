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
import PostCardStatic from "components/post/PostCardStatic";
import CommentListRoot from "components/comment/CommentListRoot";
import AboutProfileCard from "components/profile/AboutProfileCard";
import type { PresenceChannel } from "pusher-js";
import Pusher from "pusher-js";
import { PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from "utils/constants";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";

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

const PostPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { id } = props;
  const {
    data: post,
    isLoading,
    isError,
    isSuccess,
  } = trpc.post.getById.useQuery({
    id,
  });
  const category =
    post &&
    post.post &&
    trpc.category.getById.useQuery({
      id: post.post.categoryId,
    });

  const [memberCount, setMemberCount] = useState<number>(0);

  useEffect(() => {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
    const pusherClient = new Pusher(PUSHER_APP_KEY, {
      forceTLS: true,
      cluster: PUSHER_APP_CLUSTER,
      authEndpoint: "/api/pusher/channel-auth",
      auth: {
        headers: { user_id: randomUserId },
      },
    });

    const channel = pusherClient.subscribe(`presence-${id}`) as PresenceChannel;
    channel.bind("pusher:subscription_succeeded", () =>
      setMemberCount(channel.members.count)
    );

    return () => {
      pusherClient.unsubscribe(`presence-${id}`);
    };
  }, []);

  return (
    <Layout type="TIMELINE">
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 right-1/2 flex flex-col items-center justify-center gap-2 text-2xl text-zinc-300">
          <Spinner />
        </div>
      )}
      <section className="sm:w-[36rem]">
        {isError && <div>Error</div>}
        {post && (
          <>
            <PostCardStatic
              post={post.post}
              category={category?.data?.categoryName ?? ""}
              memberCount={memberCount}
            />
          </>
        )}
      </section>
      <section className="col-start-1 row-start-2 flex flex-col gap-2">
        {post &&
          post.post !== null &&
          category?.data?.categoryName === "discussion" && (
            <CommentListRoot
              postId={post.post.id}
              postStatus={post.post.status}
            />
          )}
      </section>
      <section className="row-span-2 hidden max-w-xs lg:block lg:w-72">
        <AboutProfileCard userId={post?.post?.userId ?? ""} />
      </section>
    </Layout>
  );
};

export default PostPage;
