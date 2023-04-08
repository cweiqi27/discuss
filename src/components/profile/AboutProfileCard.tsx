import { IconExternalLink } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
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
      className="sticky top-24 flex flex-col items-center justify-evenly gap-4 rounded-lg border border-zinc-700 px-4 py-2"
      initial="static"
      variants={stickyVariants}
      animate={isLiftSticky ? "enter" : "exit"}
    >
      <h2 className="text-xl font-bold text-zinc-300">ABOUT THE AUTHOR</h2>
      {user && (
        <>
          <Avatar
            size="lg"
            src={user.image ?? ""}
            name={user.name ?? ""}
            profileSlug={user.id}
          />

          <Link
            href={`/users/${user.id}`}
            className="wrap group inline-flex items-center gap-2 text-lg font-semibold"
          >
            <span className="text-lg font-semibold text-zinc-300">
              {user.name}
            </span>
            <IconExternalLink className="text-zinc-400 transition group-hover:text-zinc-300" />
          </Link>
          <q className="text-sm italic text-zinc-500">{user.profileBio}</q>

          <RecentActivities userId={user.id} numberOfRecords={2} />
        </>
      )}
    </motion.div>
  );
}

export default AboutProfileCard;
