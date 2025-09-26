import { assistantApi, AssistantRequest } from "@/lib/api/assistant";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Simple message interface
export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    choice?: string; // For user messages with choices
}

// Simple assistant state interface
interface AssistantState {
    // State
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    // Actions
    askWithChoice: (text: string, choice: string) => Promise<void>;
    clearMessages: () => void;
    setError: (error: string | null) => void;
}

// Helper function to generate unique IDs
const generateId = () => `msg_${crypto.randomUUID()}`;

export const useAssistantStore = create<AssistantState>()(
    devtools(
        (set, get) => ({
            // Initial state
            messages: [],
            isLoading: false,
            error: null,

            // Actions
            askWithChoice: async (text: string, choice: string) => {
                const state = get();

                // Don't send if already loading
                if (state.isLoading) return;

                try {
                    // Clear any previous errors
                    set({ error: null }, false, "assistant/clearError");

                    // Add user message immediately
                    const userMessage: Message = {
                        id: generateId(),
                        role: "user",
                        content: text,
                        choice,
                    };

                    set(
                        (state) => ({
                            messages: [...state.messages, userMessage],
                            isLoading: true,
                        }),
                        false,
                        "assistant/addUserMessage"
                    );

                    // Prepare request
                    const request: AssistantRequest = {
                        text,
                        choice,
                    };

                    // Send to API
                    const response = await assistantApi.sendMessage(request);

                    // Add assistant response
                    const assistantMessage: Message = {
                        id: generateId(),
                        role: "assistant",
                        content: response,
                    };

                    set(
                        (state) => ({
                            messages: [...state.messages, assistantMessage],
                            isLoading: false,
                        }),
                        false,
                        "assistant/addAssistantMessage"
                    );
                } catch (error) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : "Failed to send message";

                    set(
                        {
                            error: errorMessage,
                            isLoading: false,
                        },
                        false,
                        "assistant/sendMessageError"
                    );
                }
            },

            clearMessages: () => {
                set(
                    { messages: [], error: null },
                    false,
                    "assistant/clearMessages"
                );
            },

            setError: (error: string | null) => {
                set({ error }, false, "assistant/setError");
            },
        }),
        {
            name: "assistant-store",
        }
    )
);
