"use client";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { User } from "@/types/auth";
import { HttpResponse } from "@/types/http";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Custom hook for managing user authentication state and session validation
 * Handles automatic login/logout based on token validity and user session
 */
export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const { addToast } = useToastStore();
    const { user, login, logout } = useAuthStore();

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
        const publicAuthRoutes = ["/auth/signin", "/auth/signup"];

        if (response) {
            login(response.data, useAuthStore.getState().token!);
        } else if (isError) {
            logout();

            // only redirect + toast if not on an auth page
            if (!publicAuthRoutes.includes(pathname)) {
                addToast({ type: "error", message: "You must log in" });
                router.push("/auth/signin");
            }
        }
    }, [response, isError, login, logout, addToast, router, pathname]);

    return { user, isLoading };
}
