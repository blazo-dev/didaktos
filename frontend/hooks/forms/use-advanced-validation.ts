"use client";

import { useToastStore } from "@/stores/ui-store";
import { useCallback } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface ValidationRule<T> {
    field: keyof T;
    validate: (value: any, allValues: T) => string | boolean;
    message?: string;
}

export interface ValidationOptions {
    showToast?: boolean;
    focusOnError?: boolean;
}

export function useAdvancedValidation<T extends FieldValues>(
    form: UseFormReturn<T>,
    customRules: ValidationRule<T>[] = [],
    options: ValidationOptions = {}
) {
    const { addToast } = useToastStore();
    const { showToast = true, focusOnError = true } = options;

    const validateForm = useCallback(async (): Promise<boolean> => {
        const isValid = await form.trigger();

        if (!isValid) {
            const errors = form.formState.errors;
            const firstErrorField = Object.keys(errors)[0];

            if (focusOnError && firstErrorField) {
                form.setFocus(firstErrorField as any);
            }

            if (showToast) {
                const firstError = Object.values(errors)[0];
                addToast({
                    type: "error",
                    message:
                        (firstError?.message as string) ||
                        "Please fix the validation errors.",
                });
            }

            return false;
        }

        // Run custom validation rules
        const formValues = form.getValues();
        for (const rule of customRules) {
            const result = rule.validate(formValues[rule.field], formValues);

            if (typeof result === "string" || result === false) {
                const errorMessage =
                    typeof result === "string"
                        ? result
                        : rule.message || "Validation failed";

                form.setError(rule.field as any, {
                    type: "custom",
                    message: errorMessage,
                });

                if (focusOnError) {
                    form.setFocus(rule.field as any);
                }

                if (showToast) {
                    addToast({
                        type: "error",
                        message: errorMessage,
                    });
                }

                return false;
            }
        }

        return true;
    }, [form, customRules, addToast, showToast, focusOnError]);

    const validateField = useCallback(
        async (fieldName: keyof T): Promise<boolean> => {
            const isValid = await form.trigger(fieldName as any);

            if (!isValid && showToast) {
                const error = form.formState.errors[fieldName];
                if (error?.message) {
                    addToast({
                        type: "error",
                        message: error.message as string,
                    });
                }
            }

            return isValid;
        },
        [form, addToast, showToast]
    );

    const clearErrors = useCallback(() => {
        form.clearErrors();
    }, [form]);

    return {
        validateForm,
        validateField,
        clearErrors,
        errors: form.formState.errors,
        isValid: form.formState.isValid,
    };
}

// Commonly used validation rules
export const commonValidationRules = {
    passwordMatch: <T extends { password: string; confirmPassword: string }>(
        message = "Passwords do not match"
    ): ValidationRule<T> => ({
        field: "confirmPassword" as keyof T,
        validate: (value, allValues) => value === allValues.password || message,
        message,
    }),

    uniqueEmail: <T extends { email: string }>(
        existingEmails: string[],
        message = "This email is already registered"
    ): ValidationRule<T> => ({
        field: "email" as keyof T,
        validate: (value) =>
            !existingEmails.includes(value?.toLowerCase()) || message,
        message,
    }),

    dateRange: <T extends { startDate: string; endDate: string }>(
        message = "End date must be after start date"
    ): ValidationRule<T> => ({
        field: "endDate" as keyof T,
        validate: (value, allValues) => {
            if (!value || !allValues.startDate) return true;
            return new Date(value) > new Date(allValues.startDate) || message;
        },
        message,
    }),
};
