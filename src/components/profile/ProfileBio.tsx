import Textarea from "components/form/Textarea";
import { useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";
import ProfileBioEdit from "./ProfileBioEdit";

type ProfileBioProps = {
  user: RouterOutputs["user"]["getById"];
};

const ProfileBio = ({ user }: ProfileBioProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const { data: profileBio } = trpc.user.getProfileBio.useQuery({
    userId: user.id,
  });

  return (
    <>
      {edit ? (
        <ProfileBioEdit
          user={user}
          profileBio={profileBio?.profileBio ?? undefined}
          setEdit={setEdit}
        />
      ) : (
        <div className="flex flex-col gap-2 bg-zinc-700 p-2">
          <p className="text-lg text-zinc-400">
            {profileBio && profileBio.profileBio
              ? profileBio.profileBio
              : "Say something about yourself."}
          </p>
        </div>
      )}
    </>
  );
};

export default ProfileBio;
