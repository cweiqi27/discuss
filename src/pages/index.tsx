import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Layout from "components/layout/Layout";
import { PusherProvider } from "utils/pusher";
import Pusher from "pusher-js";
import PostCreate from "components/post/PostCreate";
import PostList from "components/post/PostList";
import Auth from "components/Auth";

const Home: NextPage = (props) => {
  return (
    <Layout>
      <PostCreate />
      <div className="flex flex-col items-center gap-2">
        <PostList />
      </div>
    </Layout>
  );
};

export default Home;

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
