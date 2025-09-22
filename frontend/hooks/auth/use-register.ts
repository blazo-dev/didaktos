import { apiFetch } from "@/lib/api";
import { RegisterRequest } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterRequest) =>
            apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}
