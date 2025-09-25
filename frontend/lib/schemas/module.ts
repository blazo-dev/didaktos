import { z } from "zod";

export const moduleSchema = z.object({
    title: z.string()
        .min(1, "Module title is required")
        .max(255, "Module title must be less than 255 characters"),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;