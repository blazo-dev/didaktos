import { apiFetch } from "@/lib/api/api";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { SignInRequest } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useSignIn() {
    const addToast = useToastStore((state) => state.addToast);
    const login = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: (data: SignInRequest) =>
            apiFetch<{ data: { token: string; user: any } }>("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (res) => {
            login(res.data.user, res.data.token); // ✅ single point of truth
            addToast({ message: "Login successful", type: "success" });
        },
        onError: (error: any) => {
            addToast({ message: error.message, type: "error" });
        },
    });
}
