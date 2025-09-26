import { Course, Lesson, Module } from "@/types/course";
import { create } from "zustand";

interface CoursesState {
    courses: Course[];
    currentCourse: Course | null;
    setCourses: (courses: Course[]) => void;
    setCurrentCourse: (course: Course | null) => void;

    currentLesson: Lesson | null;
    setCurrentLesson: (course: Lesson | null) => void;

    currentModule: Module | null;
    setCurrentModule: (module: Module | null) => void;
}

export const useCoursesStore = create<CoursesState>((set) => ({
    courses: [],
    currentCourse: null,
    setCourses: (courses) => set({ courses }),
    setCurrentCourse: (currentCourse) => set({ currentCourse }),

    currentLesson: null,
    setCurrentLesson: (currentLesson) => set({ currentLesson }),

    currentModule: null,
    setCurrentModule: (currentModule) => set({ currentModule }),
}));
