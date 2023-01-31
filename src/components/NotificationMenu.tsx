import { Popover, Transition } from "@headlessui/react";
import { IconBell } from "@tabler/icons";

type Notification = {
  id: number;
  text: string;
};

type NotificationMenuProps = {
  notifcations: Notification[];
};

const NotificationMenu = (props: NotificationMenuProps) => {
  return (
    <Popover className="relative">
      <Popover.Button className="cursor-pointer rounded-full bg-zinc-800 p-2 outline-none transition-colors hover:bg-zinc-700 ui-open:bg-purple-600/30">
        <IconBell
          stroke={1}
          className="fill-zinc-300 text-zinc-200 ui-open:fill-teal-400 ui-open:text-teal-300"
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
        <Popover.Panel className="absolute right-1/2 max-h-[80vh] overflow-y-auto rounded bg-zinc-700 p-1 text-zinc-200 md:w-56">
          {props.notifcations.map((notification) => {
            return (
              <div
                key={notification.id}
                className="rounded-sm p-2 hover:bg-zinc-400"
              >
                {notification.text}
              </div>
            );
          })}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NotificationMenu;
