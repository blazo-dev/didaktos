import { useAuthStore } from "@/stores/auth-store";
import { HttpResponse } from "@/types/http";
import { Assignment, Course, Lesson, Module } from "../../types/course";
import { apiFetch } from "./api";

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const coursesApi = {
    // Course CRUD operations
    async getCourses(): Promise<Course[]> {
        const response = await apiFetch<HttpResponse<Course[]>>("/courses", {
            method: "GET",
            headers: {
                ...getAuthHeaders(),
            },
        });

        console.log("Fetched courses:", response);
        return response.data;
    },

    async getCourse(id: string): Promise<Course> {
        const response = await apiFetch<HttpResponse<Course>>(
            `/courses/${id}`,
            {
                method: "GET",
                headers: {
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
                ...getAuthHeaders(),
            },
            body: JSON.stringify(courseData),
        });
        return response.data;
    },

    async updateCourse(
        id: string,
        courseData: Partial<Course>
    ): Promise<Course> {
        const response = await apiFetch<HttpResponse<Course>>(
            `/courses/${id}`,
            {
                method: "PUT",
                headers: {
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(courseData),
            }
        );
        return response.data;
    },

    async deleteCourse(id: string): Promise<void> {
        await apiFetch<HttpResponse<void>>(`/courses/${id}`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        });
    },

    async enrollInCourse(
        courseId: string,
        enrollmentCode?: string
    ): Promise<void> {
        await apiFetch<HttpResponse<void>>(`/courses/${courseId}/enroll`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ enrollmentCode }),
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
            `/courses/${courseId}/modules/${moduleId}`,
            {
                method: "PUT",
                headers: {
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(moduleData),
            }
        );
        return response.data;
    },

    async deleteModule(courseId: string, moduleId: string): Promise<void> {
        await apiFetch<HttpResponse<void>>(
            `/courses/${courseId}/modules/${moduleId}`,
            {
                method: "DELETE",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );
    },

    // Lesson CRUD operations
    async createLesson(
        courseId: string,
        moduleId: string,
        lessonData: Omit<Lesson, "id" | "moduleId">
    ): Promise<Lesson> {
        const response = await apiFetch<HttpResponse<Lesson>>(
            `/courses/${courseId}/modules/${moduleId}/lessons`,
            {
                method: "POST",
                headers: {
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
                    ...getAuthHeaders(),
                },
            }
        );
        return response.data;
    },

    async updateLesson(
        courseId: string,
        moduleId: string,
        lessonId: string,
        lessonData: Partial<Lesson>
    ): Promise<Lesson> {
        const response = await apiFetch<HttpResponse<Lesson>>(
            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
            {
                method: "PUT",
                headers: {
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(lessonData),
            }
        );
        return response.data;
    },

    async deleteLesson(
        courseId: string,
        moduleId: string,
        lessonId: string
    ): Promise<void> {
        await apiFetch<HttpResponse<void>>(
            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
            {
                method: "DELETE",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );
    },

    // Assignment CRUD operations
    async createAssignment(
        courseId: string,
        moduleId: string,
        assignmentData: Omit<Assignment, "id" | "moduleId">
    ): Promise<Assignment> {
        const response = await apiFetch<HttpResponse<Assignment>>(
            `/courses/${courseId}/modules/${moduleId}/assignments`,
            {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(assignmentData),
            }
        );
        return response.data;
    },

    async getAssignment(
        courseId: string,
        moduleId: string,
        assignmentId: string
    ): Promise<Assignment> {
        const response = await apiFetch<HttpResponse<Assignment>>(
            `/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`,
            {
                method: "GET",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );
        return response.data;
    },

    async updateAssignment(
        courseId: string,
        moduleId: string,
        assignmentId: string,
        assignmentData: Partial<Assignment>
    ): Promise<Assignment> {
        const response = await apiFetch<HttpResponse<Assignment>>(
            `/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`,
            {
                method: "PUT",
                headers: {
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(assignmentData),
            }
        );
        return response.data;
    },

    async deleteAssignment(
        courseId: string,
        moduleId: string,
        assignmentId: string
    ): Promise<void> {
        await apiFetch<HttpResponse<void>>(
            `/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`,
            {
                method: "DELETE",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );
    },
};
