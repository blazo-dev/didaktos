import { HttpResponse } from "@/types/http";
import { apiPost } from "./api";

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
    async sendMessage(assistantReq: AssistantRequest): Promise<string> {
        const response = await apiPost<HttpResponse<string>>(
            `/assistant`,
            assistantReq
        );

        return response.data;
    },
};
