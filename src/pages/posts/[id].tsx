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
import PostCardStatic from "components/post/PostCardStatic";
import CommentListRoot from "components/comment/CommentListRoot";
import SortByButton from "components/SortByButton";
import AboutProfileCard from "components/profile/AboutProfileCard";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from "utils/constants";

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

  return (
    <Layout type="TIMELINE">
      <section className="sm:w-[36rem]">
        {isLoading && <div>Loading</div>}
        {isError && <div>Error</div>}
        {post && (
          <PostCardStatic
            post={post.post}
            category={category?.data?.categoryName ?? ""}
          />
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
      <section className="row-span-2 hidden max-w-xs sm:block lg:w-72">
        <AboutProfileCard userId={post?.post?.userId ?? ""} />
        {/* <AlgoliaShowcase /> */}
      </section>
    </Layout>
  );
};

export default PostPage;
