export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: {
        id: string;
        name: string;
        email: string;
    };
    enrollments: string[];
    modules: Module[];
    createdAt: string;
    updatedAt: string;
}

export interface Module {
    id: string;
    courseId: string;
    title: string;
    lessons: Lesson[];
    assignments: Assignment[];
}

export interface Lesson {
    id: string;
    moduleId: string;
    title: string;
    content: string;
}

export interface Assignment {
    id: string;
    moduleId: string;
    title: string;
    description: string;
    dueDate: string;
    maxPoints: number;
    type: "quiz" | "essay" | "project" | "discussion";
    submissions?: Submission[];
}

export interface Student {
    id: string;
    name: string;
    email: string;
    enrolledAt: string;
}

export interface Resource {
    id: string;
    name: string;
    url: string;
    type: "pdf" | "video" | "link" | "image";
}

export interface Submission {
    id: string;
    studentId: string;
    assignmentId: string;
    content: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
}
