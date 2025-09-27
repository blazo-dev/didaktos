import { AuthResponse, SignUpRequest, User } from "@/types/auth";
import { HttpResponse } from "@/types/http";
import { apiGet, apiPost } from "./api";

export const authApi = {
    async signIn(email: string, password: string): Promise<AuthResponse> {
        const response = await apiPost<HttpResponse<AuthResponse>>(
            `/auth/login`,
            {
                email,
                password,
            }
        );
        return response.data;
    },

    async signUp({
        name,
        email,
        password,
        confirmPassword,
    }: SignUpRequest): Promise<AuthResponse> {
        const response = await apiPost<HttpResponse<AuthResponse>>(
            `/auth/register`,
            {
                name,
                email,
                password,
                confirmPassword,
            }
        );
        return response.data;
    },

    async checkSession(): Promise<User> {
        const response = await apiGet<HttpResponse<User>>(`/auth/me`);
        return response.data;
    },
};
