import { authApi } from "@/lib/api/auth";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { SignInRequest } from "@/types/auth";

export function useSignIn() {
    const login = useAuthStore((state) => state.login);

    return useApiMutation(
        ({ email, password }: SignInRequest) => authApi.signIn(email, password),
        {
            successMessage: "Login successful! Updated",
            errorMessage: "Failed to login. Please try again.",
            invalidateKeys: ["auth"],
            onSuccess: ({ token, user }) => {
                login(user, token);
            },
        }
    );
}
