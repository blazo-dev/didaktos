"use client";

import { useAssistantStore } from "@/stores/assistant-store";

/**
 * Custom hook for AI assistant management (simplified version)
 * Provides convenient methods for interacting with the assistant
 */
export function useAssistant() {
    const {
        messages,
        isLoading,
        error,
        askWithChoice,
        clearMessages,
        setError,
    } = useAssistantStore();

    // Helper functions
    const hasMessages = messages.length > 0;
    const hasError = Boolean(error);

    // Get message counts
    const totalMessages = messages.length;
    const userMessages = messages.filter((msg) => msg.role === "user");
    const assistantMessages = messages.filter(
        (msg) => msg.role === "assistant"
    );

    // Get last assistant message
    const lastAssistantMessage =
        assistantMessages[assistantMessages.length - 1] || null;

    return {
        // State
        messages,
        error,
        hasMessages,
        hasError,
        isLoading,
        totalMessages,

        // Actions
        askWithChoice,
        clearMessages,
        setError,

        // Computed values
        userMessages,
        assistantMessages,
        lastAssistantMessage,
    };
}
