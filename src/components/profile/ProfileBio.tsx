import { IconPencil } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import ProfileBioEdit from "./ProfileBioEdit";

type ProfileBioProps = {
  user: RouterOutputs["user"]["getById"];
  isSessionUser: boolean;
};

const ProfileBio = ({ user, isSessionUser }: ProfileBioProps) => {
  const [edit, setEdit] = useState<boolean>(false);
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
          profileBio={user.profileBio ?? ""}
          setEdit={setEdit}
        />
      ) : (
        <div className="flex flex-col rounded border border-zinc-900 transition hover:border-purple-900">
          <div className="inline-flex items-center justify-between gap-2 rounded-t bg-zinc-800 p-2">
            <h2 className="text-lg font-semibold text-zinc-300">ABOUT ME</h2>
            {isSessionUser && (
              <button
                onClick={() => setEdit(true)}
                className="rounded-full p-2 text-zinc-300 transition hover:bg-zinc-700 hover:opacity-80"
              >
                <IconPencil />
              </button>
            )}
          </div>
          <div className="rounded-b bg-zinc-700 p-2">
            <p className="break-words font-serif text-zinc-400">
              {user.profileBio ? user.profileBio : unsetBioText}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileBio;
