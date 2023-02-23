import { Popover, Transition } from "@headlessui/react";
import { trpc } from "utils/trpc";
import Notification from "components/notification/Notification";
import { IconBell } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Spinner from "components/Spinner";
import { useState } from "react";

const NotificationPopover = () => {
  const { data: sessionData } = useSession();
  const [fetchNotification, setFetchNotification] = useState<boolean>(false);

  const {
    data,
    isLoading,
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

  return sessionData ? (
    <Popover className="relative">
      <Popover.Button
        onClick={() => setFetchNotification(true)}
        className="cursor-pointer rounded-full p-2 outline-none transition-colors hover:bg-zinc-700 ui-open:bg-purple-600/30"
      >
        <IconBell
          stroke={1}
          className="text-zinc-200 ui-open:fill-teal-400 ui-open:text-teal-300"
        />
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
          className="absolute right-0 top-1 overflow-y-auto rounded-md 
        bg-zinc-800 shadow shadow-zinc-600 sm:absolute sm:right-1 sm:h-auto sm:max-h-[80vh] sm:w-72"
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
