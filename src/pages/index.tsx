import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import Layout from "components/layout/Layout";
import PostCreate from "components/post/PostCreate";
import PostList from "components/post/PostList";
import CategoryTabs from "components/CategoryTabs";
import { useCategoryStore } from "store/categoryStore";
import StickyList from "components/sticky/StickyList";
import SignInToCommentButton from "components/SignInToCommentButton";
import { useState } from "react";
import { Popover } from "@headlessui/react";

const Home: NextPage = (props) => {
  const category = useCategoryStore((state) => state.category);
  const { data: userId } = trpc.auth.getUserId.useQuery();

  return userId ? (
    <Layout type="TIMELINE">
      <section className="col-span-2">
        <PostCreate />
        <CategoryTabs />
      </section>
      {/* Left */}
      <section className="space-y-4">
        <PostList categoryName={category} />
      </section>
      {/* Right */}
      <section className="col-start-2 col-end-3 row-start-2 row-end-3 hidden max-w-xs sm:block lg:w-72">
        <StickyList />
      </section>
    </Layout>
  ) : (
    <Layout type="TIMELINE">
      <section className="col-span-2">
        <PostCreate />
        <CategoryTabs />
      </section>
      {/* Left */}
      <section className="space-y-4">
        <PostList categoryName={category} />
      </section>
      {/* Right */}
      <section className="col-start-2 col-end-3 row-start-2 row-end-3 hidden max-w-xs lg:block lg:w-72">
        <StickyList />
      </section>
      <SignInToCommentButton />
    </Layout>
  );
};

export default Home;
