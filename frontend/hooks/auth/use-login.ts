import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { LoginRequest } from "@/lib/types/auth";

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginRequest) =>
            apiFetch<{ data: { token: string; user: any } }>("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (res) => {
            localStorage.setItem("token", res.data.token);
            // aquí puedes guardar user en Zustand
        },
    });
}


