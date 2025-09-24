"use client";

import Loader from "@/components/layout/loader";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { addToast } = useToastStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        logout();

        queryClient.clear();

        addToast({ type: "info", message: "You have logged out" });

        router.replace("/");

    }, [logout, addToast, queryClient, router]);

    return <Loader text="Logging out..." />;
}
