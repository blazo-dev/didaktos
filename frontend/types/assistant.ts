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
