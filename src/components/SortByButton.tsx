import { Menu } from "@headlessui/react";
import {
  IconAlarmMinus,
  IconArticle,
  IconCaretDown,
  IconFlame,
} from "@tabler/icons-react";
import { useSortStore } from "store/sortStore";

const SortByButton = () => {
  const sortBy = useSortStore((state) => state.sortBy);
  const updateSortByTimeAsc = useSortStore(
    (state) => state.updateSortByTimeAsc
  );
  const updateSortByTimeDesc = useSortStore(
    (state) => state.updateSortByTimeDesc
  );
  const updateSortByVotes = useSortStore((state) => state.updateSortByVotes);

  const sortByText =
    sortBy === "timeAsc"
      ? "Earliest"
      : sortBy === "timeDesc"
      ? "Latest"
      : "Votes";

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button
          className="inline-flex items-center gap-1 rounded-lg bg-zinc-700 
          p-2 text-zinc-300 transition ui-open:bg-violet-800 ui-open:text-teal-300 ui-not-open:hover:bg-zinc-600"
        >
          Sort by:
          <span className="italic">{sortByText}</span>
          <span>
            <IconCaretDown className="transition duration-75 ui-open:rotate-180" />
          </span>
        </Menu.Button>
        <Menu.Items
          as="div"
          className="absolute flex w-full flex-col rounded bg-zinc-800 p-1 shadow shadow-zinc-600"
        >
          <Menu.Item
            as="button"
            onClick={updateSortByVotes}
            className={`${
              sortBy === "votes"
                ? "bg-zinc-600 text-zinc-300"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
            } inline-flex gap-2 rounded px-3 py-1`}
          >
            <IconFlame />
            Votes
          </Menu.Item>
          <Menu.Item
            as="button"
            onClick={updateSortByTimeDesc}
            className={`${
              sortBy === "timeDesc"
                ? "bg-zinc-600 text-zinc-300"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
            } inline-flex gap-2 rounded px-3 py-1`}
          >
            <IconArticle />
            Latest
          </Menu.Item>
          <Menu.Item
            as="button"
            onClick={updateSortByTimeAsc}
            className={`${
              sortBy === "timeAsc"
                ? "bg-zinc-600 text-zinc-300"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-300"
            } inline-flex gap-2 rounded px-3 py-1`}
          >
            <IconAlarmMinus />
            Earliest
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  );
};

export default SortByButton;
