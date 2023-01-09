import { IconBell } from "@tabler/icons";
import DropdownMenu from "components/DropdownMenu";
import LogoLink from "components/LogoLink";

const Header = () => {
  return (
    <nav
      className="z-50 flex w-full items-end justify-between border-b-2 
    border-slate-800/5 bg-gradient-to-tl from-slate-50/5 via-slate-50/10 to-slate-50/20 px-2 drop-shadow md:px-4"
    >
      <LogoLink />
      <div>something</div>
      <div>
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
      </div>
    </nav>
  );
};

export default Header;
