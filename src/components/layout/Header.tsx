import { IconBell, IconSearch } from "@tabler/icons-react";
import Search from "components/algolia/Search";
import AuthButton from "components/AuthButton";
import LogoLink from "components/LogoLink";
import NotificationPopover from "components/notification/NotificationPopover";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { lazy, Suspense, useEffect, useState } from "react";
import { useHeaderStore } from "store/headerStore";
import { useStickyStore } from "store/stickyStore";
import { headerVariants } from "utils/framer";
import { useScrollPositionDebounce } from "utils/hooks";
import { trpc } from "utils/trpc";

const Header = () => {
  /**
   * Zustand Stores
   */
  const isShowHeader = useHeaderStore((state) => state.showHeader);
  const showHeaderTrue = useHeaderStore((state) => state.updateShowHeaderTrue);
  const showHeaderFalse = useHeaderStore(
    (state) => state.updateShowHeaderFalse
  );
  const liftStickyTrue = useStickyStore((state) => state.updateLiftStickyTrue);
  const liftStickyFalse = useStickyStore(
    (state) => state.updateLiftStickyFalse
  );

  const [search, setSearch] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useScrollPositionDebounce(
    ({ currPos }) => {
      if (currPos.y < -350) {
        if (currPos.y > scrollPosition) {
          showHeaderTrue();
          liftStickyFalse();
        } else {
          showHeaderFalse();
          liftStickyTrue();
        }
      } else {
        showHeaderTrue();
        liftStickyFalse();
      }
      setScrollPosition(currPos.y);
      console.log(isShowHeader);
    },
    undefined,
    undefined,
    undefined,
    300
  );

  useEffect(() => {
    return () => {
      showHeaderTrue();
      liftStickyFalse();
    };
  }, [showHeaderTrue, liftStickyFalse]);

  return (
    <>
      <motion.nav
        variants={headerVariants}
        animate={isShowHeader ? "enter" : "exit"}
        className={`fixed top-0 ${
          search ? "" : "z-50"
        } flex h-20 w-full items-center justify-between
          border-b-[0.05rem] border-zinc-800 bg-gradient-to-r from-zinc-900/20 to-zinc-900/40 pb-1 backdrop-blur md:px-4`}
      >
        <div className="flex gap-2">
          <LogoLink />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearch(!search)}
            className="group inline-flex items-center gap-1 rounded-full p-2"
          >
            <IconSearch className="text-zinc-400 transition group-hover:text-zinc-300 sm:text-zinc-500" />
            <input
              type="text"
              className="hidden h-8 w-32 cursor-text rounded-full border border-zinc-500 bg-zinc-900 px-2 outline-none transition placeholder:italic group-hover:border-purple-300 sm:block"
              placeholder="Search..."
            />
          </button>
          <NotificationPopover />
          <AuthButton />
        </div>
      </motion.nav>
      <Search search={search} setSearch={setSearch} />
    </>
  );
};

export default Header;
