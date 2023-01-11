import { IconBell } from "@tabler/icons";
import Auth from "components/Auth";
import DropdownMenu from "components/DropdownMenu";
import LogoLink from "components/LogoLink";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="z-50 flex w-full items-end justify-between md:px-4">
      <div className="flex gap-2">
        <LogoLink />
        <Link href="/" className="self-center">
          <h1
            className="bg-clip-text align-bottom text-3xl font-extrabold
            tracking-wide text-zinc-200 hover:bg-gradient-to-br hover:from-teal-500 hover:via-purple-500
              hover:to-rose-500 hover:text-transparent"
          >
            Discuss
          </h1>
        </Link>
      </div>
      <div className="flex items-center">
        <DropdownMenu
          menuButton={
            <IconBell
              stroke={1}
              className="fill-zinc-600 text-zinc-200 hover:fill-pink-500"
            />
          }
        >
          <div>idk</div>
          <div>something</div>
        </DropdownMenu>
        <Auth />
      </div>
    </nav>
  );
};

export default Header;
