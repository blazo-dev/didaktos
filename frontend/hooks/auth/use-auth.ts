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
            const token = useAuthStore.getState().token;
            if (!token) throw new Error("No token");

            return apiFetch<HttpResponse<User>>("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        retry: false,
    });

    useEffect(() => {
        const publicAuthRoutes = ["/", "/auth/signin", "/auth/signup"];

        if (response) {
            login(response.data, useAuthStore.getState().token!);
        } else if (isError && !isLoggingOut) {
            // Only show error toast and redirect if this is NOT a voluntary logout
            logout();

            // only redirect + toast if not on an auth page and not logging out voluntarily
            if (!publicAuthRoutes.includes(pathname)) {
                addToast({ type: "error", message: "You must log in" });
                router.push("/auth/signin");
            }
        } else if (isError && isLoggingOut) {
            // If this is a voluntary logout, just clean up without showing error
            logout();
        }
    }, [response, isError, isLoggingOut, login, logout, addToast, router, pathname]);

    return { user, isLoading };
}
