import { Popover, Transition } from "@headlessui/react";
import { trpc } from "utils/trpc";
import Notification from "components/notification/Notification";
import { IconBell } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";
import { useHeaderStore } from "store/headerStore";
import { PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from "utils/constants";
import Pusher from "pusher-js";
import CountIndicator from "components/CountIndicator";

const NotificationPopover = () => {
  const isShowHeader = useHeaderStore((state) => state.showHeader);
  const { data: sessionData } = useSession();
  const [fetchNotification, setFetchNotification] = useState<boolean>(false);

  const { data: sessionUserId } = trpc.auth.getUserId.useQuery();

  const utils = trpc.useContext();

  useEffect(() => {
    Pusher.logToConsole = true;
    let pusherClient: Pusher;
    if (Pusher.instances.length) {
      pusherClient = Pusher.instances[0] as Pusher;
      pusherClient.connect();
    } else {
      const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
      pusherClient = new Pusher(PUSHER_APP_KEY, {
        forceTLS: true,
        cluster: PUSHER_APP_CLUSTER,
        authEndpoint: "/api/pusher/user-auth",
        auth: {
          headers: { user_id: randomUserId },
        },
      });
    }

    const userChannel = "user-" + sessionUserId;
    const channel = pusherClient.subscribe(userChannel);
    channel.bind("send-notification", () => {
      utils.notification.getNotificationCount.invalidate();
    });
  }, [utils.notification.getNotificationCount]);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetched,
    isFetchingNextPage,
  } = trpc.notification.getAllCursor.useInfiniteQuery(
    {
      limit: 7,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!fetchNotification,
    }
  );

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];

  const { data: newNotification } =
    trpc.notification.getNotificationCount.useQuery({
      userId: sessionUserId ?? "",
    });

  const setNewnotificationCount =
    trpc.notification.updateNotificationCount.useMutation({
      async onMutate() {
        await utils.notification.getNotificationCount.cancel();

        const prevNewNotificationCountData =
          utils.notification.getNotificationCount.getData();

        utils.notification.getNotificationCount.setData(
          { userId: sessionUserId ?? "" },
          (old) =>
            old
              ? {
                  ...old,
                  newNotificationCount: 0,
                }
              : old
        );

        return { prevNewNotificationCountData };
      },
      onError(err, prevNewNotificationCountData, ctx) {
        utils.notification.getNotificationCount.setData(
          { userId: sessionUserId ?? "" },
          ctx?.prevNewNotificationCountData
        );
      },
      onSettled: () => {
        utils.notification.getNotificationCount.invalidate();
      },
    });

  const handleClickPopover = () => {
    setFetchNotification(true);
    if (newNotification && newNotification.newNotificationCount > 0) {
      setNewnotificationCount.mutate({
        userId: sessionUserId ?? "",
        count: 0,
      });
    }
  };

  return sessionData ? (
    <Popover className="relative">
      <Popover.Button
        onClickCapture={handleClickPopover}
        className="relative inline-flex rounded-full p-2 outline-none transition-colors hover:bg-zinc-700 ui-open:bg-purple-600/30"
      >
        <IconBell
          stroke={1}
          className={`text-zinc-200 ui-open:fill-teal-400 ui-open:text-teal-300`}
        />
        {newNotification && newNotification.newNotificationCount > 0 && (
          <CountIndicator count={newNotification.newNotificationCount} />
        )}
      </Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          className={`absolute right-0 top-1 ${
            isShowHeader ? "block" : "hidden"
          } overflow-y-auto rounded-md 
bg-zinc-800 shadow shadow-zinc-600 sm:right-1 sm:h-auto sm:max-h-[80vh] sm:w-72`}
        >
          <div className="border-b-[1px] border-zinc-400 p-2">
            <h2 className="text-2xl font-semibold text-zinc-200">
              Notifications
            </h2>
          </div>
          {notifications.map((notification) => {
            return (
              <Notification key={notification.id} notification={notification} />
            );
          })}

          {isFetched && notifications.length < 1 && (
            <span className="flex items-center gap-4 rounded-sm px-2 py-4 text-lg text-zinc-200">
              No notifications yet.
            </span>
          )}

          {!isFetching && !isFetchingNextPage && hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="flex w-full justify-center py-2 text-zinc-200 hover:bg-zinc-700"
            >
              View more
            </button>
          )}

          {isFetching && (
            <div className="flex justify-center p-2">
              <Spinner />
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  ) : (
    <></>
  );
};

export default NotificationPopover;
