
import { create } from "zustand";

const useModalStore = create((set) => ({
  formRequestModal: false, // initial state

  // function to open modal
  openFormRequestModal: () => set({ formRequestModal: true }),

  // function to close modal
  closeFormRequestModal: () => set({ formRequestModal: false }),
}));

export default useModalStore;
