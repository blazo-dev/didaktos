import { z } from "zod";

// Course creation/update schema
export const courseSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Course title is required" })
        .min(3, { message: "Course title must be at least 3 characters" })
        .max(100, { message: "Course title must be less than 100 characters" })
        .trim()
        .refine((val) => val.length > 0, {
            message: "Course title cannot be empty",
        }),
    description: z
        .string()
        .min(1, { message: "Course description is required" })
        .min(10, {
            message: "Course description must be at least 10 characters",
        })
        .max(1000, {
            message: "Course description must be less than 1000 characters",
        })
        .trim()
        .refine((val) => val.length > 0, {
            message: "Course description cannot be empty",
        }),
});

export type CourseFormData = z.infer<typeof courseSchema>;
