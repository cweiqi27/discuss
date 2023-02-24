import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import Layout from "components/layout/Layout";
import { PusherProvider } from "utils/pusher";
import Pusher from "pusher-js";
import PostCreate from "components/post/PostCreate";
import PostList from "components/post/PostList";
import StickyList from "components/StickyList";

const Home: NextPage = (props) => {
  const { data: userRole } = trpc.auth.getUserRole.useQuery();
  return (
    <Layout type="TIMELINE">
      <section className="col-span-2">
        <PostCreate />
      </section>
      {/* Left */}
      <section className="space-y-4">
        <PostList categoryName="announcement" />
      </section>
      {/* Right */}
      <section className="col-start-2 col-end-3 row-start-2 row-end-3 max-w-xs lg:w-72">
        <StickyList />
        {/* <AlgoliaShowcase /> */}
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

// const AlgoliaShowcase: React.FC = () => {
//   trpc.algolia.pushIndex.useQuery();

//   return <></>;
// };
