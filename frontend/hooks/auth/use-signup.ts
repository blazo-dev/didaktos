import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { AuthResponse, SignUpRequest } from "@/types/auth";
import { HttpResponse } from "@/types/http";
import { useMutation } from "@tanstack/react-query";

export function useSignUp() {
    const addToast = useToastStore((state) => state.addToast);
    const login = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: (data: SignUpRequest) =>
            apiFetch<HttpResponse<AuthResponse>>("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (res) => {
            login(res.data.user, res.data.token);
            addToast({
                message: "Registration successful!",
                type: "success",
            });
        },
        onError: (error: any) => {
            addToast({
                message:
                    error?.message || "Registration failed. Please try again.",
                type: "error",
            });
        },
    });
}
