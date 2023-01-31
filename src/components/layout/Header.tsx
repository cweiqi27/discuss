import { IconBell } from "@tabler/icons";
import Auth from "components/Auth";
import LogoLink from "components/LogoLink";
import NotificationMenu from "components/NotificationMenu";
import Link from "next/link";

const Header = () => {
  const notifications = [
    {
      id: 1,
      text: "test",
    },
    {
      id: 1,
      text: "abcd",
    },
    {
      id: 1,
      text: "abcd",
    },
    {
      id: 1,
      text: "abcd",
    },
  ];

  return (
    <nav className="z-50 flex w-full justify-between py-1 md:px-4">
      <div className="flex gap-2">
        <LogoLink />
        {/* <Link href="/" className="self-center">
          <h1
            className="bg-clip-text align-bottom text-3xl font-extrabold
            tracking-wide text-zinc-200 hover:bg-gradient-to-br hover:from-teal-500 hover:via-purple-500
              hover:to-rose-500 hover:text-transparent"
          >
            Discuss
          </h1>
        </Link> */}
      </div>
      <div className="flex items-center gap-2">
        <NotificationMenu notifcations={notifications} />
        <Auth />
      </div>
    </nav>
  );
};

export default Header;
