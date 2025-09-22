import { User } from "@/types/auth";
import { Toast } from "@/types/toast";
import { create } from "zustand";

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
