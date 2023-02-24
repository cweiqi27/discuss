import { Menu } from "@headlessui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DotsMenu = ({ children }: Props) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button>
        <IconDotsVertical className="text-zinc-500 hover:text-zinc-400 ui-open:text-teal-500 ui-open:hover:text-teal-500" />
      </Menu.Button>
      <Menu.Items
        as="div"
        className="absolute -right-1 rounded bg-zinc-800 shadow shadow-zinc-600"
      >
        {children}
      </Menu.Items>
    </Menu>
  );
};

export default DotsMenu;
