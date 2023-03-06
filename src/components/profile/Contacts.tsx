import { IconMail, IconPhone } from "@tabler/icons-react";
import { useMemo } from "react";
import { GMAIL_COMPOSE_URL } from "utils/constants";
import type { RouterOutputs } from "utils/trpc";

type ContactsProps = {
  user: RouterOutputs["user"]["getById"];
};

const Contacts = ({ user }: ContactsProps) => {
  const composeEmailLink = useMemo(() => {
    return GMAIL_COMPOSE_URL + user.email;
  }, [user]);

  return (
    <div className="rounded border border-zinc-900 transition hover:border-purple-900">
      <div className="rounded-t bg-zinc-800 p-2">
        <h2 className="text-lg font-semibold text-zinc-300">CONTACTS</h2>
      </div>
      <div className="flex flex-col rounded-b bg-zinc-700">
        <a
          target="_blank"
          href={composeEmailLink}
          rel="noopener noreferrer"
          className="group inline-flex gap-4 p-2  transition hover:bg-zinc-600"
        >
          <IconMail className="text-zinc-300" />
          <span className="text-zinc-400 transition group-hover:text-zinc-300">
            {user.email ?? "-"}
          </span>
        </a>
        <div className="inline-flex gap-4 p-2">
          <IconPhone className="text-zinc-300" />
          <span className="text-zinc-400 hover:text-zinc-300">
            {user.phoneNo ?? "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
