import { useAuthStore } from "@/stores/auth-store";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiRequestOptions extends RequestInit {
    requireAuth?: boolean;
    skipDefaultHeaders?: boolean;
}

export async function apiFetch<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const {
        requireAuth = true,
        skipDefaultHeaders = false,
        ...fetchOptions
    } = options;

    // Build headers
    const headers: Record<string, string> = {};

    if (!skipDefaultHeaders) {
        headers["Content-Type"] = "application/json";
    }

    if (requireAuth) {
        const token = useAuthStore.getState().token;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            ...headers,
            ...(fetchOptions.headers || {}),
        },
        ...fetchOptions,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "API request failed");
    }

    return res.json();
}

// Convenience methods
export const apiGet = <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" });

export const apiPost = <T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
) =>
    apiFetch<T>(endpoint, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
    });

export const apiPut = <T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
) =>
    apiFetch<T>(endpoint, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
    });

export const apiDelete = <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" });
