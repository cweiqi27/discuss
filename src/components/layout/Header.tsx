import { IconBell } from "@tabler/icons-react";
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

  const { data: userRole } = trpc.auth.getUserRole.useQuery();

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
        className={`fixed top-0 z-50 flex h-20 w-full items-center justify-between
          border-b-[0.05rem] border-zinc-800 bg-gradient-to-r from-zinc-900/20 to-zinc-900/40 pb-1 backdrop-blur md:px-4`}
      >
        <div className="flex gap-2">
          <LogoLink />
        </div>
        {/* <div className="absolute -z-10 flex w-screen items-center justify-center ">
        <div className="h-8 w-32 rounded-full bg-zinc-200 text-lg text-green-500">
          TEST
        </div>
      </div> */}
        <div className="flex items-center gap-2">
          <NotificationPopover />
          <AuthButton />
        </div>
      </motion.nav>
    </>
  );
};

export default Header;
