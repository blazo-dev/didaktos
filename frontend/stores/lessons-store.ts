import { Lesson } from "@/types/course";
import { create } from "zustand";

interface LessonsState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    setLessons: (courses: Lesson[]) => void;
    setCurrentLesson: (course: Lesson | null) => void;
}

export const useLessonsStore = create<LessonsState>((set) => ({
    lessons: [],
    currentLesson: null,
    setLessons: (lessons) => set({ lessons }),
    setCurrentLesson: (currentLesson) => set({ currentLesson }),
}));
