// Types for the AI Assistant system

export interface AssistantMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    choice?: string; // For user messages with specific choice context
}

export interface AssistantRequest {
    text: string;
    choice: string;
}

export interface AssistantResponse {
    message: string;
    timestamp: Date;
    conversationId?: string;
}

export interface ConversationStats {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    lastActivity: Date | null;
}

export type AssistantChoice =
    | "study_plan"
    | "assignment_help"
    | "concept_explanation"
    | "exam_prep"
    | "time_management"
    | "general";

export interface AssistantError {
    message: string;
    code?: string;
    timestamp: Date;
}
