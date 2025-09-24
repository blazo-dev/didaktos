import { Enrollment } from "@/types/enrollment";
import { HttpResponse } from "@/types/http";
import { apiFetch, getAuthHeaders } from "./api";

// Helper function to get auth headers

export const enrollmentsApi = {
    // Enrollment CRUD operations
    async getEnrollments(): Promise<Enrollment[]> {
        const response = await apiFetch<HttpResponse<Enrollment[]>>(
            "/courses/enrollments",
            {
                method: "GET",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

        console.log("Fetched enrollments:", response);
        return response.data;
    },

    async createEnrollment(
        enrollmentData: Omit<Enrollment, "id" | "createdAt" | "updatedAt">
    ): Promise<Enrollment> {
        const response = await apiFetch<HttpResponse<Enrollment>>(
            "/courses/enrollments",
            {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(enrollmentData),
            }
        );
        return response.data;
    },

    async updateEnrollment(
        id: string,
        courseData: Partial<Enrollment>
    ): Promise<Enrollment> {
        const response = await apiFetch<HttpResponse<Enrollment>>(
            `/courses/enrollments`,
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
};
