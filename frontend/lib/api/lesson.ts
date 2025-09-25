import { HttpResponse } from "@/types/http";
import { Lesson } from "../../types/course";
import { apiFetch, getAuthHeaders } from "./api";

export const lessonsApi = {
    // Lesson CRUD operations
    async createLesson(
        moduleId: string,
        lessonData: Omit<Lesson, "id" | "moduleId">
    ): Promise<Lesson> {
        const response = await apiFetch<HttpResponse<Lesson>>(
            `/modules/${moduleId}/lessons`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(lessonData),
            }
        );
        return response.data;
    },

    async getLesson(
        courseId: string,
        moduleId: string,
        lessonId: string
    ): Promise<Lesson> {
        const response = await apiFetch<HttpResponse<Lesson>>(
            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
            }
        );
        return response.data;
    },

    async updateLesson(
        lessonId: string,
        lessonData: Partial<Lesson>
    ): Promise<Lesson> {
        const response = await apiFetch<HttpResponse<Lesson>>(
            `/modules/lessons/${lessonId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(lessonData),
            }
        );
        return response.data;
    },

    async deleteLesson(lessonId: string): Promise<void> {
        await apiFetch<HttpResponse<void>>(`/modules/lessons/${lessonId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
        });
    },
};
