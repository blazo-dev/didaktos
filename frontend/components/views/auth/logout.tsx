"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const { addToast } = useToastStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        // Redirect to login page
        router.replace("/");

        // Clear session data
        localStorage.removeItem("token");
        setUser(null);
        queryClient.clear(); // clear all queries

        // Show toast
        addToast({ type: "info", message: "You have logged out" });

    }, [setUser, addToast, queryClient, router]);

    return null; // No UI needed
}
