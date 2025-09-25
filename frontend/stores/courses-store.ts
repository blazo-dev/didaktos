import { Course } from "@/types/course";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CoursesState {
    courses: Course[];
    currentCourse: Course | null;
    isEnrolled?: boolean; 
    setCourses?: (courses: Course[]) => void;
    setCurrentCourse?: (course: Course | null) => void;
}

const initialState: CoursesState = {
    courses: [],
    currentCourse: null,
};

export const useCoursesStore = create<CoursesState>((set) => ({
    courses: [],
    currentCourse: null,

    setCourses: (courses) => set({ courses }),
    setCurrentCourse: (currentCourse) => set({ currentCourse }),
}));
