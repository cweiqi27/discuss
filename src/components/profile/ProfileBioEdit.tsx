import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import Textarea from "components/form/Textarea";
import LoadingBlur from "components/LoadingBlur";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import type { EditProfileBioFormSchemaType } from "types/form";
import { EditProfileBioFormSchema } from "types/form";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";

type ProfileBioEditProps = {
  user: RouterOutputs["user"]["getById"];
  profileBio?: string | undefined;
  setEdit: Dispatch<SetStateAction<boolean>>;
};

const ProfileBioEdit = ({ user, profileBio, setEdit }: ProfileBioEditProps) => {
  const utils = trpc.useContext();

  const editProfileBio = trpc.user.createOrEditProfileBio.useMutation({
    onSuccess() {
      setEdit(false);
      utils.user.getProfileBio.invalidate();
    },
  });

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(EditProfileBioFormSchema),
  });

  const onSubmit = () => {
    const bio: EditProfileBioFormSchemaType["bio"] = getValues("bio");

    if (isDirty) {
      editProfileBio.mutate({ userId: user.id, content: bio });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col gap-2"
      >
        <Textarea
          name="bio"
          label="Bio"
          placeholder={profileBio ? "" : "Say something about yourself"}
          register={register}
          addStyles="h-32 outline-teal-500"
          value={profileBio ?? ""}
        />
        <ErrorMessage
          errors={errors}
          name="content"
          as="span"
          className="text-pink-400"
        />
        <button
          type="submit"
          className="self-start rounded-full bg-teal-500 px-3 py-1 text-zinc-300 transition hover:opacity-80"
        >
          Edit
        </button>
        {editProfileBio.isLoading && <LoadingBlur />}
      </form>
    </>
  );
};

export default ProfileBioEdit;
