import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { LoginRequest } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useSignIn() {
    const addToast = useToastStore((state) => state.addToast);
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: (data: LoginRequest) =>
            apiFetch<{ data: { token: string; user: any } }>("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (res) => {
            // Save token
            localStorage.setItem("token", res.data.token);

            // Save user globally
            setUser(res.data.user);

            // Show success toast
            addToast({ message: "Login successful", type: "success" });
        },
        onError: (error: any) => {
            addToast({ message: error.message, type: "error" });
        },
    });
}
