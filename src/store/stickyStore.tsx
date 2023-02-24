import { create } from "zustand";

interface StickyState {
  liftSticky: boolean;
  updateLiftStickyTrue: () => void;
  updateLiftStickyFalse: () => void;
}

export const useStickyStore = create<StickyState>()((set) => ({
  liftSticky: false,
  updateLiftStickyTrue: () => set(() => ({ liftSticky: true })),
  updateLiftStickyFalse: () => set(() => ({ liftSticky: false })),
}));
