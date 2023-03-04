import { create } from "zustand";

interface CategoryState {
  category: "discussion" | "announcement";
  updateCategoryDiscussion: () => void;
  updateCategoryAnnouncement: () => void;
}

export const useCategoryStore = create<CategoryState>()((set) => ({
  category: "announcement",
  updateCategoryDiscussion: () => set(() => ({ category: "discussion" })),
  updateCategoryAnnouncement: () => set(() => ({ category: "announcement" })),
}));
