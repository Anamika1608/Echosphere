import { create } from "zustand";
import type { PgCommunity } from "@/types";

interface PgCommunityStore {
  pgCommunity: PgCommunity | null;
  setPgCommunity: (pgCommunity: PgCommunity) => void;
  updatePgCommunity: (updatedFields: Partial<PgCommunity>) => void;
  clearPgCommunity: () => void;
}

export const usePgCommunityStore = create<PgCommunityStore>((set) => ({
  pgCommunity: null,

  setPgCommunity: (pgCommunity) => set({ pgCommunity }),

  updatePgCommunity: (updatedFields) =>
    set((state) =>
      state.pgCommunity
        ? { pgCommunity: { ...state.pgCommunity, ...updatedFields } }
        : {}
    ),

  clearPgCommunity: () => set({ pgCommunity: null }),
}));
