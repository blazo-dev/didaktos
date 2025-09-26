import z from "zod";

export const submissionSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Submission content is required" })
        .min(10, {
            message: "Submission content must be at least 10 characters",
        })
        .trim(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
