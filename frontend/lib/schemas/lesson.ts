import { z } from "zod";

// Course creation/update schema
export const lessonSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Lesson title is required" })
        .min(3, { message: "Lesson title must be at least 3 characters" })
        .max(100, { message: "Lesson title must be less than 100 characters" })
        .trim()
        .refine((val) => val.length > 0, {
            message: "Lesson title cannot be empty",
        }),
    content: z
        .string()
        .min(1, { message: "Lesson content is required" })
        .min(10, {
            message: "Lesson content must be at least 10 characters",
        })
        .trim()
        .refine((val) => val.length > 0, {
            message: "Lesson content cannot be empty",
        }),
});

export type LessonFormData = z.infer<typeof lessonSchema>;
