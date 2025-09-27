import { HttpResponse } from "@/types/http";
import { Course, Module } from "../../types/course";
import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const coursesApi = {
    // Course CRUD operations
    async getCourses(): Promise<Course[]> {
        const response = await apiGet<HttpResponse<Course[]>>("/courses");
        return response.data ?? [];
    },

    async getCourse(id: string): Promise<Course> {
        const response = await apiGet<HttpResponse<Course>>(`/courses/${id}`);
        return response.data;
    },

    async createCourse(
        courseData: Omit<Course, "id" | "createdAt" | "updatedAt">
    ): Promise<Course> {
        const response = await apiPost<HttpResponse<Course>>(
            "/courses",
            courseData
        );
        return response.data;
    },

    async updateCourse(
        id: string,
        { title, description }: Partial<Course>
    ): Promise<Course> {
        const response = await apiPut<HttpResponse<Course>>(`/courses/${id}`, {
            id,
            title,
            description,
        });
        return response.data;
    },

    async deleteCourse(id: string): Promise<void> {
        await apiDelete<HttpResponse<void>>(`/courses/${id}`);
    },

    // Module CRUD operations
    async createModule(
        courseId: string,
        moduleData: Omit<Module, "id" | "courseId">
    ): Promise<Module> {
        const response = await apiPost<HttpResponse<Module>>(
            `/courses/${courseId}/modules`,
            moduleData
        );
        return response.data;
    },

    async updateModule(
        courseId: string,
        moduleId: string,
        moduleData: Partial<Module>
    ): Promise<Module> {
        const response = await apiPut<HttpResponse<Module>>(
            `/modules/${moduleId}`,
            moduleData
        );
        return response.data;
    },

    async deleteModule(moduleId: string): Promise<void> {
        await apiDelete<HttpResponse<void>>(`/modules/${moduleId}`);
    },
};
