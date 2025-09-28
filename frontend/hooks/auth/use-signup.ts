import { authApi } from "@/lib/api/auth";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { SignUpRequest } from "@/types/auth";

/**
 * Authentication hook for user registration functionality
 *
 * @description Handles new user registration by creating an account via the API and automatically
 * logging in the user upon successful registration. Shows success/error toasts and invalidates
 * auth-related queries.
 *
 * @returns {UseMutationResult} React Query mutation object with methods:
 *   - mutate: Function to trigger sign-up with {name, email, password, confirmPassword}
 *   - isLoading: Boolean indicating if registration request is in progress
 *   - error: Any error from the registration attempt
 *
 * @example
 * ```tsx
 * const signUp = useSignUp();
 *
 * const handleSubmit = (data: SignUpRequest) => {
 *   signUp.mutate(data, {
 *     onSuccess: () => router.push('/dashboard')
 *   });
 * };
 * ```
 */
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
