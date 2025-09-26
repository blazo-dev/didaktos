import { HttpResponse } from "@/types/http";
import { Assignment } from "../../types/course";
import { apiFetch, getAuthHeaders } from "./api";

export const assignmentsApi = {
    getAssignmentsByModule: async (moduleId: string) => {
        const response = await apiFetch<HttpResponse<Assignment[]>>(
            `/modules/${moduleId}/assignments`,
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

    // Assignment CRUD operations
    async createAssignment(
        moduleId: string,
        assignmentData: Omit<Assignment, "id" | "moduleId">
    ): Promise<Assignment> {
        const response = await apiFetch<HttpResponse<Assignment>>(
            `/modules/${moduleId}/assignments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(assignmentData),
            }
        );
        return response.data;
    },

    async getAssignment(assignmentId: string): Promise<Assignment> {
        const response = await apiFetch<HttpResponse<Assignment>>(
            `/modules/assignments/${assignmentId}`,
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

    async updateAssignment(
        assignmentId: string,
        assignmentData: Partial<Assignment>
    ): Promise<Assignment> {
        const response = await apiFetch<HttpResponse<Assignment>>(
            `/modules/assignments/${assignmentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(assignmentData),
            }
        );
        return response.data;
    },

    async deleteAssignment(assignmentId: string): Promise<void> {
        await apiFetch<HttpResponse<void>>(
            `/modules/assignments/${assignmentId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
            }
        );
    },
};
