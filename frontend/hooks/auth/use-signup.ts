import { apiFetch } from "@/lib/api";
import { useToastStore } from "@/stores/toast-store";
import { AuthResponse, RegisterRequest } from "@/types/auth";
import { HttpResponse } from "@/types/http";
import { useMutation } from "@tanstack/react-query";

export function useSignUp() {
    const addToast = useToastStore((state) => state.addToast);

    return useMutation({
        mutationFn: (data: RegisterRequest) =>
            apiFetch<HttpResponse<AuthResponse>>("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (res) => {
            localStorage.setItem("token", res.data.token);
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
