import { Enrollment } from "@/types/enrollment";
import { HttpResponse } from "@/types/http";
import { apiGet, apiPost, apiPut } from "./api";

export const enrollmentsApi = {
    // Enrollment CRUD operations
    async getEnrollments(): Promise<Enrollment[]> {
        const response = await apiGet<HttpResponse<Enrollment[]>>(
            "/courses/enrollments"
        );

        return response.data;
    },

    async createEnrollment(enrollmentData: {
        courseId: string;
    }): Promise<Enrollment> {
        const response = await apiPost<HttpResponse<Enrollment>>(
            "/courses/enrollments",
            enrollmentData
        );
        return response.data;
    },

    async updateEnrollment(
        id: string,
        courseData: Partial<Enrollment>
    ): Promise<Enrollment> {
        const response = await apiPut<HttpResponse<Enrollment>>(
            `/courses/enrollments`,
            courseData
        );
        return response.data;
    },
};
