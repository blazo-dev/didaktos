import { Assignment, Course, Lesson, Module, Submission } from "@/types/course";
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

    currentSubmission: Submission | null;
    setCurrentSubmission: (submission: Submission | null) => void;

    currentAssignment: Assignment | null;
    setCurrentAssignment: (assignment: Assignment | null) => void;
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

    currentAssignment: null,
    setCurrentAssignment: (currentAssignment) => set({ currentAssignment }),

    currentSubmission: null,
    setCurrentSubmission: (currentSubmission) => set({ currentSubmission }),
}));
