export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    status: "active" | "completed" | "dropped";
    createdAt: string;
    updatedAt: string;
}
