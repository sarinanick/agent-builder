"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/lib/types";

interface AuthState {
  user: User | null;
  role: Role;
  hydrated: boolean;
  setRole: (role: Role) => void;
  signIn: (userId: string) => void;
  signOut: () => void;
  setHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: "guest",
      hydrated: false,

      setRole: (role) => {
        if (role === "guest") {
          set({ role: "guest", user: null });
        } else {
          set({ role, user: null });
        }
      },

      signIn: (userId) => {
        set({ user: { id: userId, name: "User", headline: "", bio: "", location: "", avatar: "", role: "buyer", trustScore: 0, reviewCount: 0, completionCount: 0, skills: [], tools: [] }, role: "buyer" });
      },

      signOut: () => {
        set({ user: null, role: "guest" });
      },

      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "agent-builder-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
