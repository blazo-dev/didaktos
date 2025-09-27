import { HttpResponse } from "@/types/http";
import { Assignment } from "../../types/course";
import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const assignmentsApi = {
    getAssignmentsByModule: async (moduleId: string) => {
        const response = await apiGet<HttpResponse<Assignment[]>>(
            `/modules/${moduleId}/assignments`
        );
        return response.data;
    },

    // Assignment CRUD operations
    async createAssignment(
        moduleId: string,
        assignmentData: {
            title: string;
            description: string;
            dueDate: string;
        }
    ): Promise<Assignment> {
        const response = await apiPost<HttpResponse<Assignment>>(
            `/modules/${moduleId}/assignments`,
            assignmentData
        );
        return response.data;
    },

    async getAssignment(assignmentId: string): Promise<Assignment> {
        const response = await apiGet<HttpResponse<Assignment>>(
            `/modules/assignments/${assignmentId}`
        );
        return response.data;
    },

    async updateAssignment(
        assignmentId: string,
        assignmentData: Partial<Assignment>
    ): Promise<Assignment> {
        const response = await apiPut<HttpResponse<Assignment>>(
            `/modules/assignments/${assignmentId}`,
            assignmentData
        );
        return response.data;
    },

    async deleteAssignment(assignmentId: string): Promise<void> {
        await apiDelete<HttpResponse<void>>(
            `/modules/assignments/${assignmentId}`
        );
    },
};
