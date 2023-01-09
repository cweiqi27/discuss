import { env } from "env/server.mjs";
import Pusher, { Channel } from "pusher-js";
import vanillaCreate, { StoreApi } from "zustand/vanilla";
import createContext from "zustand/context";
import { useEffect, useState } from "react";

const pusher_key = "497b54cac83d8542725d";
const pusher_cluster = "ap1";

interface PusherZustandStore {
  pusherClient: Pusher;
}

const createPusherStore = (slug: string) => {
  const pusherClient = new Pusher(pusher_key, {
    cluster: "ap1",
  });

  const channel = pusherClient.subscribe("my-channel");

  const helloWorld = () => {
    alert("hello world");
  };

  channel.bind("test-event", helloWorld);

  const store = vanillaCreate<PusherZustandStore>(() => {
    return {
      pusherClient: pusherClient,
      channel: channel,
    };
  });

  return store;
};

const {
  Provider: PusherZustandStoreProvider,
  useStore: usePusherZustandStore,
} = createContext<StoreApi<PusherZustandStore>>();

export const PusherProvider: React.FC<
  React.PropsWithChildren<{ slug: string }>
> = ({ slug, children }) => {
  const [store, updateStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore(slug);
    updateStore(newStore);
    return () => {
      const pusher = newStore.getState().pusherClient;
      console.log("disconnecting pusher and destroying store", pusher);
      console.log(
        "(Expect a warning in terminal after this, React Dev Mode and all)"
      );
      pusher.disconnect();
      newStore.destroy();
    };
  }, [slug]);

  if (!store) return null;

  return (
    <PusherZustandStoreProvider createStore={() => store}>
      {children}
    </PusherZustandStoreProvider>
  );
};
