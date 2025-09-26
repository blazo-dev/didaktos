import { HttpResponse } from "@/types/http";
import { apiFetch, getAuthHeaders } from "./api";

// Request types for the assistant API
export interface AssistantRequest {
    text: string;
    choice: string;
}

// Assistant API object (simplified)
export const assistantApi = {
    /**
     * Send a message to the AI assistant with choice context
     */
    async sendMessage(request: AssistantRequest): Promise<string> {
        const response = await apiFetch<HttpResponse<string>>("/assistant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(request),
        });

        return response.data;
    },
};
