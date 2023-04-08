import { create } from "zustand";

interface HitState {
  isShowHit: boolean;
  updateShowHitFalse: () => void;
  updateShowHitTrue: () => void;
}

export const useHitState = create<HitState>()((set) => ({
  isShowHit: true,
  updateShowHitFalse: () => set(() => ({ isShowHit: false })),
  updateShowHitTrue: () => set(() => ({ isShowHit: true })),
}));
