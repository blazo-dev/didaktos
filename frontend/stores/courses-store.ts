import { Course } from "@/types/course";
import { create } from "zustand";

interface CoursesState {
    courses: Course[];
    currentCourse: Course | null;
    setCourses: (courses: Course[]) => void;
    setCurrentCourse: (course: Course | null) => void;
}

export const useCoursesStore = create<CoursesState>((set) => ({
    courses: [],
    currentCourse: null,
    setCourses: (courses) => set({ courses }),
    setCurrentCourse: (currentCourse) => set({ currentCourse }),
}));
