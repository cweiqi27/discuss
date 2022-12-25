import { Menu, Transition } from "@headlessui/react";

type DropdownMenuProps = {
  menuButton: React.ReactNode;
  children?: React.ReactNode;
};

const DropdownMenu = (props: DropdownMenuProps) => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button>{props.menuButton}</Menu.Button>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <div className="fixed right-0 rounded bg-white p-2">
            <Menu.Items>
              <Menu.Item>
                <div className="">{props.children}</div>
              </Menu.Item>
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
