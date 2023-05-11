import { Dialog, Disclosure } from "@headlessui/react";
import {
  IconCircleArrowDownFilled,
  IconShieldLock,
  IconTrash,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import type { RouterOutputs } from "utils/trpc";
import { trpc } from "utils/trpc";

type SecurityCardProps = {
  user: RouterOutputs["user"]["getById"];
};

const SecurityCard = ({ user }: SecurityCardProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { data: sessionData } = useSession();
  const deleteUser = trpc.user.delete.useMutation({
    onSuccess() {
      if (sessionData?.user?.id === user.id && deleteUser.isSuccess) signOut();
    },
  });

  const handleClickDelete = () => {
    deleteUser.mutate({
      id: user.id,
    });
  };

  return (
    <>
      <Disclosure>
        <div className="rounded border-[1px] border-red-700">
          <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-lg font-semibold uppercase text-red-600">
            <div className="inline-flex items-center gap-1">
              <IconShieldLock />
              Security
            </div>
            <IconCircleArrowDownFilled className="transition duration-150 ui-open:rotate-180" />
          </Disclosure.Button>
          <Disclosure.Panel className="flex w-full flex-col gap-2">
            <div className="flex justify-between p-4">
              <div className="flex flex-col gap-1">
                <h3 className="inline-flex gap-1 font-semibold text-zinc-300">
                  <IconTrash />
                  Delete Account
                </h3>
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold">Delete</span> this user&apos;s
                  account.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1 rounded border border-red-600 px-2 text-red-600 transition hover:bg-red-600 hover:text-zinc-200"
              >
                Delete Account
              </button>
            </div>
          </Disclosure.Panel>
        </div>
      </Disclosure>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 grid place-items-center bg-zinc-900/70 p-4 backdrop-blur">
          <Dialog.Panel
            className={`w-full max-w-sm space-y-8 rounded bg-zinc-400 p-6 `}
          >
            <div className="space-y-2 rounded">
              <Dialog.Title className={`font-semibold`}>
                Are you sure you want to delete this account?
              </Dialog.Title>
              <Dialog.Description className="flex flex-col gap-2">
                <span>Id: {user.id}</span>
                <span>Name: {user.name}</span>
              </Dialog.Description>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded bg-red-600 px-4 py-2 text-zinc-300 transition hover:bg-red-500"
                onClick={handleClickDelete}
              >
                Confirm
              </button>
              <button
                className="rounded bg-zinc-700 px-4 py-2 text-zinc-400 transition hover:bg-zinc-600"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default SecurityCard;
