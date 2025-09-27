import { HttpResponse } from "@/types/http";
import { Lesson } from "../../types/course";
import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const lessonsApi = {
    // Lesson CRUD operations
    async createLesson(
        moduleId: string,
        lessonData: Omit<Lesson, "id" | "moduleId">
    ): Promise<Lesson> {
        const response = await apiPost<HttpResponse<Lesson>>(
            `/modules/${moduleId}/lessons`,
            lessonData
        );
        return response.data;
    },

    async getLesson(
        courseId: string,
        moduleId: string,
        lessonId: string
    ): Promise<Lesson> {
        const response = await apiGet<HttpResponse<Lesson>>(
            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
        );
        return response.data;
    },

    async updateLesson(
        lessonId: string,
        lessonData: Partial<Lesson>
    ): Promise<Lesson> {
        const response = await apiPut<HttpResponse<Lesson>>(
            `/modules/lessons/${lessonId}`,
            lessonData
        );
        return response.data;
    },

    async deleteLesson(lessonId: string): Promise<void> {
        await apiDelete<HttpResponse<void>>(`/modules/lessons/${lessonId}`);
    },
};
