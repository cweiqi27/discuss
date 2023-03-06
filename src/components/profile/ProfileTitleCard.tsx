import Avatar from "components/avatar/Avatar";
import { format } from "date-fns";
import { useMemo } from "react";
import type { RouterOutputs } from "utils/trpc";

type ProfileTitleCardProps = {
  user: RouterOutputs["user"]["getById"];
};

const ProfileTitleCard = ({ user }: ProfileTitleCardProps) => {
  const joinedAtDate = useMemo(() => {
    return format(user.createdAt, "MMMM do, yyyy");
  }, [user]);

  return (
    <div className="flex items-center gap-4 rounded border border-zinc-700 bg-purple-900/20 pl-4 transition hover:border-purple-900">
      <Avatar src={user.image ?? ""} alt={user.name ?? ""} size="lg" />
      <div className="flex w-full flex-col gap-1 rounded-r bg-zinc-800 p-2">
        <span className="text-3xl font-bold text-zinc-200">{user.name}</span>
        <span className="text-sm font-semibold text-zinc-400">{user.role}</span>
        <div>
          <span className="text-xs text-zinc-500">Joined at </span>
          <span className="text-xs text-zinc-500">{joinedAtDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileTitleCard;
