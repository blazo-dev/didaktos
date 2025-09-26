import { z } from "zod";

// Assignment creation/update schema
export const assignmentSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Assignment title is required" })
        .min(3, { message: "Assignment title must be at least 3 characters" })
        .max(100, {
            message: "Assignment title must be less than 100 characters",
        })
        .trim()
        .refine((val) => val.length > 0, {
            message: "Assignment title cannot be empty",
        }),
    description: z
        .string()
        .min(1, { message: "Assignment description is required" })
        .min(10, {
            message: "Assignment description must be at least 10 characters",
        })
        .trim()
        .refine((val) => val.length > 0, {
            message: "Assignment description cannot be empty",
        }),
    dueDate: z
        .string()
        .min(1, { message: "Due date is required" })
        .refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            {
                message: "Invalid due date format",
            }
        )
        .refine(
            (val) => {
                const date = new Date(val);
                const now = new Date();
                return date > now;
            },
            {
                message: "Due date must be in the future",
            }
        ),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;
