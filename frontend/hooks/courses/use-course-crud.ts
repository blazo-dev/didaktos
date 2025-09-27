import { coursesApi } from "@/lib/api/course";
import { createCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Course } from "@/types/course";

// Create standardized CRUD hooks for courses
const courseCrudHooks = createCrudHooks<Course>({
    entityName: "Course",
    invalidateKeys: ["courses"],
    api: {
        create: coursesApi.createCourse,
        update: (id: string, data: Partial<Course>) => 
            coursesApi.updateCourse(id, data),
        delete: coursesApi.deleteCourse,
    },
});

// Export individual hooks for backward compatibility
export const useCreateCourse = courseCrudHooks.useCreate!;
export const useUpdateCourse = courseCrudHooks.useUpdate!;
export const useDeleteCourse = courseCrudHooks.useDelete!;
