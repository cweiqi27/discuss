import { Menu } from "@headlessui/react";
import { IconLogin, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import UserAvatar from "./avatar/UserAvatar";

const AuthButton = () => {
  const { data: sessionData, status } = useSession();

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
          Sign in
        </button>
      )}
      {status === "loading" && (
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-400" />
      )}
      {status === "authenticated" && (
        <Menu as="div" className="relative flex items-center">
          <Menu.Button className="">
            <UserAvatar size="sm" />
          </Menu.Button>
          <div className="relative">
            <Menu.Items
              as="div"
              className="absolute right-0 top-6 flex w-max
            flex-col rounded-md bg-zinc-700 p-1"
            >
              <Menu.Item
                as="button"
                className="inline-flex gap-1 rounded p-2 text-zinc-300 transition hover:bg-zinc-600"
              >
                <IconUserCircle />
                Profile
              </Menu.Item>
              <Menu.Item
                as="button"
                className="inline-flex gap-1 rounded p-2 text-zinc-300 transition hover:bg-zinc-600"
                onClick={handleClick}
              >
                <IconLogout />
                Sign out
              </Menu.Item>
            </Menu.Items>
          </div>
        </Menu>
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
