import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Layout from "components/layout/Layout";
import PostEdit from "components/post/PostEdit";
import { trpc } from "utils/trpc";
import { createContext, createContextInner } from "server/trpc/context";
import superjson from "superjson";
import { appRouter } from "server/trpc/router/_app";
import StickyList from "components/StickyList";
import PostCardStatic from "components/post/PostCardStatic";
import CommentListRoot from "components/comment/CommentListRoot";
import SortByButton from "components/SortByButton";
import AboutProfileCard from "components/profile/AboutProfileCard";

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
  const { data, isLoading, isError, isSuccess } = trpc.post.getById.useQuery({
    id,
  });

  return (
    <Layout type="TIMELINE">
      <section className="sm:w-[36rem]">
        {isLoading && <div>Loading</div>}
        {isError && <div>Error</div>}
        {data && <PostCardStatic post={data.post} />}
      </section>
      <section className="col-start-1 row-start-2 flex flex-col gap-2">
        {data && data.post !== null && (
          <CommentListRoot postId={data.post.id} />
        )}
      </section>
      <section className="row-span-2 hidden max-w-xs sm:block lg:w-72">
        <AboutProfileCard userId={data?.post?.userId ?? ""} />
        {/* <AlgoliaShowcase /> */}
      </section>
    </Layout>
  );
};

export default PostPage;
