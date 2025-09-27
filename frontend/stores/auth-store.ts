import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoggingOut: boolean; // Track voluntary logout state
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoggingOut: (isLoggingOut: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoggingOut: false,

            login: (user, token) =>
                set(() => ({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoggingOut: false,
                })),

            logout: () =>
                set(() => ({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoggingOut: false, // Reset logging out flag
                })),

            setLoggingOut: (isLoggingOut) =>
                set(() => ({
                    isLoggingOut,
                })),
        }),
        {
            name: "auth-storage", // clave en localStorage
        }
    )
);
