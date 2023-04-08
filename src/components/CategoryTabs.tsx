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
    <div className="hidden gap-2 sm:flex">
      <button
        onClick={updateAnnouncement}
        className={`${
          category === "announcement"
            ? "border-b-2 font-bold text-zinc-200"
            : "font-semibold text-zinc-700 hover:text-zinc-400"
        } border-pink-500 text-3xl transition `}
      >
        Announcement
      </button>
      <button
        onClick={updateDiscussion}
        className={`${
          category === "discussion"
            ? "border-b-2 font-bold text-zinc-200"
            : "font-semibold text-zinc-700 hover:text-zinc-400"
        } border-pink-500 text-3xl transition `}
      >
        Discussion
      </button>
    </div>
  );
};

export default CategoryTabs;
