import { create } from "zustand";

interface PostEditState {
  edit: boolean;
  editing: boolean;
  updateEditFalse: () => void;
  updateEditTrue: () => void;
  updateEditingFalse: () => void;
  updateEditingTrue: () => void;
}

export const usePostEditStore = create<PostEditState>()((set) => ({
  edit: false,
  updateEditFalse: () => set(() => ({ edit: false })),
  updateEditTrue: () => set(() => ({ edit: true })),
  editing: false,
  updateEditingFalse: () => set(() => ({ editing: false })),
  updateEditingTrue: () => set(() => ({ editing: true })),
}));
