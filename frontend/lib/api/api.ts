import { useAuthStore } from "@/stores/auth-store";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "API request failed");
    }

    return res.json();
}

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
};