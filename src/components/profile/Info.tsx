import { IconCake, IconGenderBigender } from "@tabler/icons-react";
import { format } from "date-fns";
import { useMemo } from "react";
import type { RouterOutputs } from "utils/trpc";

type InfoProps = {
  user: RouterOutputs["user"]["getById"];
};

const Info = ({ user }: InfoProps) => {
  const birthDate = useMemo(() => {
    return user.dateOfBirth && format(user.dateOfBirth, "dd/mm/yy");
  }, [user]);

  return (
    <div className="rounded border border-zinc-900 transition hover:border-purple-900">
      <div className="rounded-t bg-zinc-800 p-2">
        <h2 className="text-lg font-semibold text-zinc-300">OTHER INFO</h2>
      </div>
      <div className="flex flex-col rounded-b bg-zinc-700">
        <div className="inline-flex gap-4 p-2 text-zinc-300">
          <IconCake />
          {birthDate ?? "-"}
        </div>
        <div className="inline-flex gap-4 p-2 text-zinc-300">
          <IconGenderBigender />
          {user.gender ?? "-"}
        </div>
      </div>
    </div>
  );
};

export default Info;
