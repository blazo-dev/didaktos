import { Enrollment } from "@/types/enrollment";
import { HttpResponse } from "@/types/http";
import { apiFetch, getAuthHeaders } from "./api";

export const enrollmentsApi = {
    // Enrollment CRUD operations
    async getEnrollments(): Promise<Enrollment[]> {
        const response = await apiFetch<HttpResponse<Enrollment[]>>(
            "/courses/enrollments",
            {
                method: "GET",
                headers: {
                    // 👈 asegurar header
                    ...getAuthHeaders(),
                },
            }
        );

        return response.data;
    },

    async createEnrollment(enrollmentData: {
        courseId: string;
    }): Promise<Enrollment> {
        const response = await apiFetch<HttpResponse<Enrollment>>(
            "/courses/enrollments",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(courseData),
            }
        );
        return response.data;
    },
};
