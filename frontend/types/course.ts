export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: {
        id: string;
        name: string;
        email: string;
    };
    students: Student[];
    modules: Module[];
    createdAt: string;
    updatedAt: string;
    status: "active" | "inactive" | "completed";
    enrollmentCode?: string;
}

export interface Module {
    id: string;
    courseId: string;
    title: string;
    description: string;
    order: number;
    lessons: Lesson[];
    assignments: Assignment[];
    isPublished: boolean;
}

export interface Lesson {
    id: string;
    moduleId: string;
    title: string;
    content: string;
    type: "text" | "video" | "document" | "interactive";
    order: number;
    duration?: number;
    resources?: Resource[];
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
