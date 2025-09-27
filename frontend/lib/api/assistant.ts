import { AssistantRequest } from "@/types/assistant";
import { HttpResponse } from "@/types/http";
import { apiPost } from "./api";

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
