"use client";

import { useAssistantStore } from "@/stores/assistant-store";

/**
 * AI assistant interaction hook for educational guidance and support
 *
 * @description Provides convenient methods for interacting with the AI assistant system.
 * Manages conversation state, message history, and assistant responses. Simplified version
 * that interfaces with the assistant store for state management.
 *
 * @returns {Object} Object containing:
 *   - messages: Array of conversation messages between user and assistant
 *   - isLoading: Boolean indicating if assistant is processing a request
 *   - sendMessage: Function to send a message to the assistant
 *   - clearConversation: Function to reset the conversation history
 *   - isTyping: Boolean indicating if assistant is currently typing a response
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, clearConversation } = useAssistant();
 *
 * const handleSendMessage = (content: string) => {
 *   sendMessage(content);
 * };
 *
 * return (
 *   <AssistantChat
 *     messages={messages}
 *     onSendMessage={handleSendMessage}
 *     isLoading={isLoading}
 *     onClear={clearConversation}
 *   />
 * );
 * ```
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
