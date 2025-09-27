import { authApi } from "@/lib/api/auth";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { SignUpRequest } from "@/types/auth";

export function useSignUp() {
    const login = useAuthStore((state) => state.login);

    return useApiMutation(
        ({ name, email, password, confirmPassword }: SignUpRequest) =>
            authApi.signUp({ name, email, password, confirmPassword }),
        {
            successMessage: "Registration successful!",
            errorMessage: "Failed to register. Please try again.",
            invalidateKeys: ["auth"],
            onSuccess: ({ token, user }) => {
                login(user, token);
            },
        }
    );
}
