import { Popover } from "@headlessui/react";
import {
  IconCaretDown,
  IconDeviceDesktopAnalytics,
  IconLogin,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";
import { useHeaderStore } from "store/headerStore";
import UserAvatar from "./avatar/UserAvatar";

const AuthButton = () => {
  const isShowHeader = useHeaderStore((state) => state.showHeader);

  const { data: sessionData, status } = useSession();

  const isModOrAdmin = useMemo(() => {
    return (
      sessionData?.user?.role === "MOD" || sessionData?.user?.role === "ADMIN"
    );
  }, [sessionData]);

  const handleClick = () => {
    sessionData ? signOut() : signIn("google");
  };

  return (
    <>
      {status === "unauthenticated" && (
        <button
          className="inline-flex gap-1 rounded-full bg-white/10 px-5 py-2 font-semibold text-zinc-300 transition hover:bg-zinc-700/80"
          onClick={handleClick}
        >
          <IconLogin />
          Sign In
        </button>
      )}
      {status === "loading" && (
        <div className="flex items-center">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-400" />
          <IconCaretDown className="text-zinc-300" />
        </div>
      )}
      {status === "authenticated" && (
        <Popover className="relative flex items-center">
          <Popover.Button className="group flex items-center outline-none">
            <UserAvatar
              size="sm"
              addStyles="group-hover:opacity-80 transition"
            />
            <IconCaretDown className="text-zinc-300 transition duration-75 group-hover:opacity-80 ui-open:rotate-180" />
          </Popover.Button>
          <div className="relative">
            <Popover.Panel
              as="div"
              className={`absolute right-0 top-6 ${
                isShowHeader ? "flex" : "hidden"
              } w-max
            flex-col rounded-md bg-zinc-700 p-1`}
            >
              <div className="flex cursor-default justify-center border-b-2 border-zinc-600 py-2 text-xs text-zinc-400">
                {sessionData.user?.name}
              </div>
              <Link
                href={`/users/${sessionData.user?.id}`}
                className="inline-flex gap-1 rounded p-2 text-zinc-300 transition hover:bg-violet-800"
              >
                <IconUserCircle />
                Profile
              </Link>
              {isModOrAdmin && (
                <Link
                  href="/monitor"
                  className="inline-flex gap-1 rounded p-2 text-zinc-300 transition hover:bg-violet-800"
                >
                  <IconDeviceDesktopAnalytics />
                  Monitor
                </Link>
              )}
              <button
                className="inline-flex gap-1 rounded p-2 text-zinc-300 transition hover:bg-violet-800"
                onClick={handleClick}
              >
                <IconLogout />
                Sign Out
              </button>
            </Popover.Panel>
          </div>
        </Popover>
      )}
      {status === "unauthenticated" && (
        <div className="fixed bottom-10 left-0 flex w-screen justify-center sm:hidden">
          <button className="rounded-full bg-zinc-700/80 px-4 py-2 text-center text-lg font-semibold text-zinc-200">
            Sign in to comment
          </button>
        </div>
      )}
    </>
  );
};

export default AuthButton;
