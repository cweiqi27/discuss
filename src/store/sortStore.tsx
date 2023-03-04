import { create } from "zustand";

interface SortState {
  sortBy: "timeAsc" | "timeDesc" | "votes";
  updateSortByTimeAsc: () => void;
  updateSortByTimeDesc: () => void;
  updateSortByVotes: () => void;
}

export const useSortStore = create<SortState>()((set) => ({
  sortBy: "timeDesc",
  updateSortByTimeAsc: () => set(() => ({ sortBy: "timeAsc" })),
  updateSortByTimeDesc: () => set(() => ({ sortBy: "timeDesc" })),
  updateSortByVotes: () => set(() => ({ sortBy: "votes" })),
}));
