import { Dialog } from "@headlessui/react";
import type { ModalProps } from "types/component";

const Modal = (props: ModalProps) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/70 p-4">
        <Dialog.Panel
          className={`w-full max-w-sm space-y-8 rounded p-6 ${props.bgColor}`}
        >
          <div className="space-y-2">
            <Dialog.Title className={`font-semibold ${props.titleColor}`}>
              {props.title}
            </Dialog.Title>
            <Dialog.Description className={`${props.descColor}`}>
              {props.description}
            </Dialog.Description>
          </div>
          <div className="flex gap-2">{props.children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
