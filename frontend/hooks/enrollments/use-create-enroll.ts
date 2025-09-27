import { enrollmentsApi } from "@/lib/api/enrollments";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";

export const useCreateEnrollment = () => {
    return useApiMutation(enrollmentsApi.createEnrollment, {
        successMessage: "Enrollment created successfully!",
        errorMessage: "Failed to create enrollment. Please try again.",
        invalidateKeys: ["courses"],
    });
};
