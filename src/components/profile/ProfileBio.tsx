import Textarea from "components/form/Textarea";
import { useMemo, useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import ProfileBioEdit from "./ProfileBioEdit";

type ProfileBioProps = {
  user: RouterOutputs["user"]["getById"];
  isSessionUser: boolean;
};

const ProfileBio = ({ user, isSessionUser }: ProfileBioProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const { data: profileBio } = trpc.user.getProfileBio.useQuery({
    userId: user.id,
  });
  const unsetBioText = useMemo(() => {
    return isSessionUser
      ? "Say something about yourself."
      : "This user has not written a bio.";
  }, [isSessionUser]);

  return (
    <>
      {edit ? (
        <ProfileBioEdit
          user={user}
          profileBio={profileBio?.profileBio ?? undefined}
          setEdit={setEdit}
        />
      ) : (
        <div className="inline-flex items-center gap-2 rounded bg-zinc-800 p-2">
          <p className="text-lg text-zinc-400">
            {profileBio && profileBio.profileBio
              ? profileBio.profileBio
              : unsetBioText}
          </p>
          <button
            onClick={() => setEdit(true)}
            className="rounded-full px-3 py-1 text-zinc-300 transition hover:bg-zinc-700 hover:opacity-80"
          >
            Edit
          </button>
        </div>
      )}
    </>
  );
};

export default ProfileBio;
