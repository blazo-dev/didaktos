import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
    const router = useRouter();
    const { addToast } = useToastStore();
    const { user, setUser } = useAuthStore();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token");

            return apiFetch<User>("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        retry: false,
    });

    // Only update state / navigate in useEffect (after render)
    useEffect(() => {
        if (data) {
            setUser(data);
        } else if (isError) {
            localStorage.removeItem("token");
            setUser(null);
            addToast({ type: "error", message: "You must log in" });
            router.push("/auth");
        }
    }, [data, isError, setUser, addToast, router]);

    return { user, isLoading };
}
