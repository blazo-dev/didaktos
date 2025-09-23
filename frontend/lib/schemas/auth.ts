// frontend/lib/schemas/auth.ts
import { z } from "zod";

// Base schema for shared fields
export const baseAuthSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});

// Sign-In schema (same as base)
export const signInSchema = baseAuthSchema;

// Sign-Up schema extends base
export const signUpSchema = baseAuthSchema
    .extend({
        name: z.string().min(1, { message: "Name is required" }),
        confirmPassword: z
            .string()
            .min(1, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
