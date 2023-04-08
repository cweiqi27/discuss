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
import SortByButton from "components/SortByButton";
import AboutProfileCard from "components/profile/AboutProfileCard";
import { useEffect } from "react";
import Pusher from "pusher-js";
import PostList from "components/post/PostList";
import StickyList from "components/sticky/StickyList";

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

const FlairPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { id } = props;

  const { data: flair } = trpc.post.getFlairById.useQuery({
    id: id,
  });

  return (
    <Layout type="TIMELINE">
      <div className="col-span-2 row-start-1">
        <h1 className="text-3xl font-extrabold text-zinc-300">
          {flair?.flairName}
        </h1>
      </div>
      <section className="row-start-2 flex flex-col gap-2">
        <PostList flairId={id} />
      </section>
      {/* <section className="col-start-2 col-end-3 row-start-2 row-end-3 hidden max-w-xs sm:block lg:w-72">
        <div className="sticky top-20 text-xl font-bold text-zinc-400">37</div>
      </section> */}
    </Layout>
  );
};

export default FlairPage;
