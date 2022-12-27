import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import PostCard from "components/post/PostCard";
import PostVote from "components/post/PostVote";
import Layout from "components/layout/Layout";

const Home: NextPage = (props) => {
  const hello = trpc.example.hello.useQuery({ text: "world" });

  return (
    <Layout>
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        T<span className="text-[hsl(280,100%,70%)]">E</span>ST
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl text-white">
          {hello.data ? hello.data.greeting : "Loading..."}
        </p>
        <AuthShowcase />
        <PostCard
          title="This is a title!This is a title!This is a title!This is a title!This is a title!This is a title!This is a title!This is a title!This is a title!This is a title!This is a title!"
          description="some content here"
        ></PostCard>
        <PostVote isFlexRow></PostVote>
      </div>
    </Layout>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
