import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import Layout from "components/layout/Layout";
import { PusherProvider } from "utils/pusher";
import Pusher from "pusher-js";
import PostCreate from "components/post/PostCreate";
import PostList from "components/post/PostList";
import StickyCard from "components/StickyCard";

const Home: NextPage = () => {
  return (
    <Layout>
      {/* Left */}
      <section className="col-span-2">
        <PostCreate />
      </section>
      <section className="flex flex-col items-center gap-2">
        <PostList />
      </section>
      {/* Right */}
      <section className="col-start-2 col-end-3 row-start-2 row-end-3 max-w-xs">
        <div className="sticky top-0">
          <div className="h-screen space-y-1 overflow-y-auto">
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
            <StickyCard color="purple" text="Importnat announcement" />
            <StickyCard color="teal" text="not importnat announcement" />
            <StickyCard color="rose" text="importttt announcement" />
          </div>
        </div>
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
