import { motion } from "framer-motion";
import { useStickyStore } from "store/stickyStore";
import { stickyVariants } from "utils/framer";
import { trpc } from "utils/trpc";
import Avatar from "../avatar/Avatar";
import RecentActivities from "./RecentActivities";

type AboutProfileCardProps = {
  userId: string;
};

function AboutProfileCard({ userId }: AboutProfileCardProps) {
  /*
   * Zustand stores
   */
  const isLiftSticky = useStickyStore((state) => state.liftSticky);

  const { data: user } = trpc.user.getById.useQuery({
    id: userId,
  });

  return (
    <motion.div
      className="sticky top-24 flex flex-col items-center justify-evenly gap-4 rounded-lg border border-zinc-700 py-2"
      initial="static"
      variants={stickyVariants}
      animate={isLiftSticky ? "enter" : "exit"}
    >
      <h2 className="text-xl font-semibold text-zinc-300">About the author</h2>
      {user && (
        <>
          <Avatar
            size="lg"
            src={user.image ?? ""}
            alt={user.name ?? ""}
            profileSlug={user.id}
          />

          <h3 className="text-lg text-zinc-300">{user.name}</h3>

          <RecentActivities userId={user.id} numberOfRecords={2} />
        </>
      )}
    </motion.div>
  );
}

export default AboutProfileCard;
