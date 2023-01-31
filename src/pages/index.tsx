import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Layout from "components/layout/Layout";
import { PusherProvider } from "utils/pusher";
import Pusher from "pusher-js";
import PostCreate from "components/post/PostCreate";
import PostList from "components/post/PostList";
import StickyCard from "components/StickyCard";
import StickyList from "components/StickyList";

const Home: NextPage = (props) => {
  const { data: userRole } = trpc.auth.getUserRole.useQuery();
  return (
    <Layout type="timeline">
      {/* Left */}
      <section className="col-span-2">
        <PostCreate />
      </section>
      <section className="space-y-4">
        <PostList />
      </section>
      {/* Right */}
      <section className="col-start-2 col-end-3 row-start-2 row-end-3 sm:w-64 lg:w-80">
        <p className="text-lg text-white">{userRole}</p>
        <StickyList />
      </section>
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
