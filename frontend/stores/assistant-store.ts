import LessonHeader from "@/components/views/lessons/lesson-header";
import { Course } from "@/types/course";
import { create } from "zustand";

interface Message {
    role: string;
    content: string;
}

interface AssistantState {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    askAssistant: (lessonContent: string) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    askAssistant: (lessonContent: string) => {
        const userMessage: Message = {
            role: "user", content: lessonContent,
        };
    }}))

