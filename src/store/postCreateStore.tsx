import { create } from "zustand";

interface PostCreateState {
  expand: boolean;
  updateExpandFalse: () => void;
  updateExpandTrue: () => void;
}

export const usePostCreateStore = create<PostCreateState>()((set) => ({
  expand: false,
  updateExpandFalse: () => set(() => ({ expand: false })),
  updateExpandTrue: () => set(() => ({ expand: true })),
}));

interface ModalState {
  modalOpen: boolean;
  updateModalOpenTrue: () => void;
  updateModalOpenFalse: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  modalOpen: false,
  updateModalOpenTrue: () => set(() => ({ modalOpen: true })),
  updateModalOpenFalse: () => set(() => ({ modalOpen: false })),
}));
