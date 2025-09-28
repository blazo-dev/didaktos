import { authApi } from "@/lib/api/auth";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { SignInRequest } from "@/types/auth";

/**
 * Authentication hook for user sign-in functionality
 *
 * @description Handles user login by validating credentials with the API and updating
 * the authentication state in the global store. Automatically shows success/error toasts
 * and invalidates auth-related queries upon successful login.
 *
 * @returns {UseMutationResult} React Query mutation object with methods:
 *   - mutate: Function to trigger sign-in with {email, password}
 *   - isLoading: Boolean indicating if sign-in request is in progress
 *   - error: Any error from the sign-in attempt
 *
 * @example
 * ```tsx
 * const signIn = useSignIn();
 *
 * const handleSubmit = (data: SignInRequest) => {
 *   signIn.mutate(data, {
 *     onSuccess: () => router.push('/dashboard')
 *   });
 * };
 * ```
 */
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
