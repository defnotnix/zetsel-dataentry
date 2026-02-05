"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, EntryMode, PollingStation } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  entryMode: EntryMode;
  selectedPollingStation: PollingStation | null;

  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setEntryMode: (mode: EntryMode) => void;
  setSelectedPollingStation: (station: PollingStation | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  entryMode: "nepali" as EntryMode,
  selectedPollingStation: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setEntryMode: (entryMode) => set({ entryMode }),
      setSelectedPollingStation: (selectedPollingStation) =>
        set({ selectedPollingStation }),
      reset: () => set(initialState),
    }),
    {
      name: "RSP-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        entryMode: state.entryMode,
        selectedPollingStation: state.selectedPollingStation,
      }),
    }
  )
);
