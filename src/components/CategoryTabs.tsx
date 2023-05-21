import { Menu } from "@headlessui/react";
import {
  IconCaretDown,
  IconMessageChatbot,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { useCategoryStore } from "store/categoryStore";

type CategoryTabsProps = {
  isMobile?: boolean;
};

const CategoryTabs = ({ isMobile }: CategoryTabsProps) => {
  const category = useCategoryStore((state) => state.category);
  const updateDiscussion = useCategoryStore(
    (state) => state.updateCategoryDiscussion
  );
  const updateAnnouncement = useCategoryStore(
    (state) => state.updateCategoryAnnouncement
  );

  return (
    <>
      {isMobile ? (
        <Menu as="div" className="relative">
          <Menu.Button
            as="div"
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-700 p-2 text-zinc-300 transition ui-open:bg-violet-800 ui-open:text-teal-300 ui-not-open:hover:bg-zinc-600"
          >
            {category === "announcement" ? (
              <IconSpeakerphone />
            ) : (
              <IconMessageChatbot />
            )}
            <span>
              <IconCaretDown className="transition duration-75 ui-open:rotate-180" />
            </span>
          </Menu.Button>

          <Menu.Items
            as="div"
            className="absolute flex w-full flex-col gap-2 rounded bg-zinc-800 p-1 shadow shadow-zinc-600"
          >
            <Menu.Item>
              <div className="flex gap-2 sm:hidden">
                <button
                  onClick={updateAnnouncement}
                  className={`${category === "announcement"
                      ? "bg-zinc-600 text-zinc-300"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
                    } inline-flex w-full gap-2 rounded px-3 py-1`}
                >
                  <IconSpeakerphone />
                </button>
              </div>
            </Menu.Item>

            <Menu.Item>
              <button
                onClick={updateDiscussion}
                className={`${category === "discussion"
                    ? "bg-zinc-600 text-zinc-300"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
                  } inline-flex w-full gap-2 rounded px-3 py-1`}
              >
                <IconMessageChatbot />
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={updateAnnouncement}
            className={`${category === "announcement"
                ? "border-b-2 font-bold text-zinc-200"
                : "font-semibold text-zinc-700 hover:text-zinc-400"
              } border-pink-500 text-3xl transition `}
          >
            Announcement
          </button>
          <button
            onClick={updateDiscussion}
            className={`${category === "discussion"
                ? "border-b-2 font-bold text-zinc-200"
                : "font-semibold text-zinc-700 hover:text-zinc-400"
              } border-pink-500 text-3xl transition `}
          >
            Discussion
          </button>
        </div>
      )}
    </>
  );
};

export default CategoryTabs;
