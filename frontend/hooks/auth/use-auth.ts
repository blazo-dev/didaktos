"use client";

import { apiFetch } from "@/lib/api/api";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/ui-store";
import { User } from "@/types/auth";
import { HttpResponse } from "@/types/http";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Custom hook for managing user authentication state and session validation
 * Handles automatic login/logout based on token validity and user session
 */
export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const { addToast } = useToastStore();
    const { user, login, logout, isLoggingOut } = useAuthStore();

    const {
        data: response,
        isLoading,
        isError,
    } = useQuery<HttpResponse<User>>({
        queryKey: ["session"],
        queryFn: async () => {
            const authState = useAuthStore.getState();
            
            // If we're in the process of logging out, don't attempt session validation
            if (authState.isLoggingOut) {
                throw new Error("Logout in progress");
            }
            
            if (!authState.token) throw new Error("No token");

            return apiFetch<HttpResponse<User>>("/auth/me", {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
        },
        retry: false,
        enabled: !isLoggingOut && !!useAuthStore.getState().token, // Don't run if logging out or no token
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const publicAuthRoutes = ["/", "/auth/signin", "/auth/signup"];

        if (response) {
            // Successful auth response - user is logged in
            login(response.data, useAuthStore.getState().token!);
        } else if (isError) {
            // Check if we're currently logging out
            const currentAuthState = useAuthStore.getState();
            
            if (currentAuthState.isLoggingOut) {
                // This is a voluntary logout - just clean up without error messages
                console.log("Voluntary logout detected - cleaning up without errors");
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
    }, [response, isError, login, logout, addToast, router, pathname]);

    return { user, isLoading };
}
