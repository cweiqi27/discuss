import { create } from "zustand";

interface HeaderState {
  showHeader: boolean;
  updateShowHeaderFalse: () => void;
  updateShowHeaderTrue: () => void;
}

export const useHeaderStore = create<HeaderState>()((set) => ({
  showHeader: true,
  updateShowHeaderFalse: () => set(() => ({ showHeader: false })),
  updateShowHeaderTrue: () => set(() => ({ showHeader: true })),
}));
