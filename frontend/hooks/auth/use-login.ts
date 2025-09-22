import { apiFetch } from "@/lib/api";
import { useToastStore } from "@/stores/toast-store";
import { LoginRequest } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
    const addToast = useToastStore((state) => state.addToast);

    return useMutation({
        mutationFn: (data: LoginRequest) =>
            apiFetch<{ data: { token: string; user: any } }>("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (res) => {
            localStorage.setItem("token", res.data.token);
            addToast({ message: "Login successful", type: "success" });
        },
        onError: (error) => {
            console.log(error);
            addToast({ message: error.message, type: "error" });
        },
    });
}
