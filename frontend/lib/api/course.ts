import { HttpResponse } from "@/types/http";
import { Course, Module } from "../../types/course";
import { apiFetch, getAuthHeaders } from "./api";

export const coursesApi = {
    // Course CRUD operations
    async getCourses(): Promise<Course[]> {
        const response = await apiFetch<HttpResponse<Course[]>>("/courses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
        });

        return response.data ?? [];
    },

    async getCourse(id: string): Promise<Course> {
        const response = await apiFetch<HttpResponse<Course>>(
            `/courses/${id}`,
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

    async createCourse(
        courseData: Omit<Course, "id" | "createdAt" | "updatedAt">
    ): Promise<Course> {
        const response = await apiFetch<HttpResponse<Course>>("/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(courseData),
        });
        return response.data;
    },

    async updateCourse(
        id: string,
        { title, description }: Partial<Course>
    ): Promise<Course> {
        const response = await apiFetch<HttpResponse<Course>>(
            `/courses/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ id, title, description }),
            }
        );
        return response.data;
    },

    async deleteCourse(id: string): Promise<void> {
        await apiFetch<HttpResponse<void>>(`/courses/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
        });
    },

    // Module CRUD operations
    async createModule(
        courseId: string,
        moduleData: Omit<Module, "id" | "courseId">
    ): Promise<Module> {
        const response = await apiFetch<HttpResponse<Module>>(
            `/courses/${courseId}/modules`,
            {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(moduleData),
            }
        );
        return response.data;
    },

    async updateModule(
        courseId: string,
        moduleId: string,
        moduleData: Partial<Module>
    ): Promise<Module> {
        const response = await apiFetch<HttpResponse<Module>>(
            `/modules/${moduleId}`,
            {
                method: "PUT",
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(moduleData),
            }
        );
        return response.data;
    },

    async deleteModule(moduleId: string): Promise<void> {
        await apiFetch<HttpResponse<void>>(`/modules/${moduleId}`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        });
    },
};
