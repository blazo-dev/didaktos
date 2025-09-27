import { coursesApi } from "@/lib/api/course";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { Module } from "@/types/course";

export const useCreateModule = (courseId: string) => {
  return useApiMutation(
    (moduleData: Omit<Module, "id" | "courseId">) =>
      coursesApi.createModule(courseId, moduleData),
    {
      successMessage: "Module created successfully!",
      errorMessage: "Failed to create module. Please try again.",
      invalidateKeys: ["courses"],
    }
  );
};