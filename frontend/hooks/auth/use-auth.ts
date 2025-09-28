"use client";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/ui-store";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Primary authentication hook for managing user session state and validation
 *
 * @description Handles user authentication state, automatic login/logout based on token validity,
 * session validation with the API, and redirects for unauthorized access. Automatically validates
 * stored tokens against the API and manages the authentication flow.
 *
 * @returns {{user: User | null, isLoading: boolean}} Object containing:
 *   - user: Current authenticated user object or null if not authenticated
 *   - isLoading: Boolean indicating if authentication check is in progress
 *
 * @example
 * ```tsx
 * const { user, isLoading } = useAuth();
 *
 * if (isLoading) return <Loading />;
 * if (!user) return <LoginForm />;
 * return <Dashboard user={user} />;
 * ```
 */
export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const { addToast } = useToastStore();
    const { user, login, logout, isLoggingOut } = useAuthStore();

    const {
        data: sessionUser,
        isLoading,
        isError,
    } = useQuery<User>({
        queryKey: ["session"],
        queryFn: async () => {
            const authState = useAuthStore.getState();

            // If we're in the process of logging out, don't attempt session validation
            if (authState.isLoggingOut) {
                throw new Error("Logout in progress");
            }

            if (!authState.token) throw new Error("No token");

            return authApi.checkSession();
        },
        retry: false,
        enabled: !isLoggingOut && !!useAuthStore.getState().token, // Don't run if logging out or no token
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const publicAuthRoutes = ["/", "/auth/signin", "/auth/signup"];

        if (sessionUser) {
            // Successful auth response - user is logged in
            login(sessionUser, useAuthStore.getState().token!);
        } else if (isError) {
            // Check if we're currently logging out
            const currentAuthState = useAuthStore.getState();

            if (currentAuthState.isLoggingOut) {
                // This is a voluntary logout - just clean up without error messages
                console.log(
                    "Voluntary logout detected - cleaning up without errors"
                );
                logout();
                return;
            }

            // This is an actual authentication failure (session expired, etc.)
            console.log("Authentication failed - showing error toast");
            logout();

            // Only redirect + toast if not on a public page
            if (!publicAuthRoutes.includes(pathname)) {
                addToast({ type: "error", message: "You must log in" });
                router.push("/auth/signin");
            }
        }
    }, [sessionUser, isError, login, logout, addToast, router, pathname]);

    return { user, isLoading };
}
