import { trpc } from "utils/trpc";
import Avatar from "./Avatar";

// The avatar of the current user
const UserAvatar = () => {
  const { data: userImage } = trpc.auth.getUserImg.useQuery();
  return (
    <div className="flex gap-2">
      <Avatar
        src={userImage ?? ""}
        alt="Me"
        profileLink="/"
        addStyles="col-start-1 col-end-2 place-self-end"
      />
    </div>
  );
};

export default UserAvatar;
