import { IconSticker } from "@tabler/icons-react";
import NavBackToTop from "components/NavBackToTop";
import { motion } from "framer-motion";
import { useStickyStore } from "store/stickyStore";
import { stickyVariants } from "utils/framer";
import { trpc } from "utils/trpc";
import StickyCard from "./StickyCard";
import StickyLoadingSkeleton from "./StickyLoadingSkeleton";

const StickyList = () => {
  /*
   * Zustand stores
   */
  const isLiftSticky = useStickyStore((state) => state.liftSticky);

  const { data: sticky, isLoading, isError } = trpc.post.getSticky.useQuery();

  return sticky?.length !== 0 ? (
    <motion.div
      className="sticky top-24 hidden lg:block"
      initial="static"
      variants={stickyVariants}
      animate={isLiftSticky ? "enter" : "exit"}
    >
      <h2 className="inline-flex items-center gap-2 bg-zinc-900 text-2xl font-bold text-zinc-200">
        <IconSticker /> STICKY
      </h2>
      <div className="mb-6 h-[70vh] space-y-2 overflow-y-auto bg-zinc-900">
        {isLoading && (
          <>
            <StickyLoadingSkeleton />
            <StickyLoadingSkeleton />
            <StickyLoadingSkeleton />
          </>
        )}
        {sticky?.map((sticky) => {
          return (
            <StickyCard key={sticky.id} text={sticky.title} color="purple" />
          );
        })}
      </div>
      <NavBackToTop />
    </motion.div>
  ) : (
    <></>
  );
};

export default StickyList;
