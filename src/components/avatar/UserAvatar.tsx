import { trpc } from "utils/trpc";
import Avatar from "./Avatar";

type UserAvatarProps = {
  size: "sm" | "md" | "lg";
  linkToProfile?: boolean;
  addStyles?: string;
};

// The avatar of the current user
const UserAvatar = ({ size, linkToProfile, addStyles }: UserAvatarProps) => {
  const { data: userImage } = trpc.auth.getUserImg.useQuery();
  const { data: userId } = trpc.auth.getUserId.useQuery();
  return (
    <div className="flex gap-2">
      <Avatar
        size={size}
        src={userImage ?? ""}
        name="Me"
        profileSlug={linkToProfile ? userId ?? "/" : undefined}
        addStyles={`col-start-1 col-end-2 place-self-end ${addStyles}`}
      />
    </div>
  );
};

export default UserAvatar;
