import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Layout from "components/layout/Layout";
import { PusherProvider } from "utils/pusher";
import Pusher from "pusher-js";
import PostCreate from "components/post/PostCreate";
import PostList from "components/post/PostList";

const Home: NextPage = (props) => {
  return (
    <Layout>
      <PostCreate />
      <div className="flex flex-col items-center gap-2">
        <PostList />
        <AuthShowcase />
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

const PusherShowcase: React.FC = () => {
  const pusher = new Pusher("12bf7d67fc9ed5e498fa", {
    cluster: "ap1",
  });

  const channel = pusher.subscribe("my-channel");
  channel.bind("my-event", function (data: string) {
    alert(JSON.stringify(data));
  });

  const something = trpc.pusher.trigger.useQuery();

  return <></>;
};
