import { coursesApi } from "@/lib/api/course";
import { createCrudHooks } from "@/lib/hooks/use-crud-hooks";
import { Course } from "@/types/course";

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

export const useCreateCourse = courseCrudHooks.useCreate!;
export const useUpdateCourse = courseCrudHooks.useUpdate!;
export const useDeleteCourse = courseCrudHooks.useDelete!;
