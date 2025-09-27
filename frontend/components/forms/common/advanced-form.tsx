'use client';

import { useAdvancedValidation, ValidationRule } from '@/hooks/forms/use-advanced-validation';
import { PerformanceConfig, useFormPerformanceMonitoring } from '@/hooks/forms/use-form-performance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { ZodType } from 'zod';
import { ErrorBoundary } from '../../common/error-boundary';
import { FormActions } from './form-actions';

interface AdvancedFormProps<T extends FieldValues> {
    initialValues?: Partial<T>;
    validationSchema: ZodType<T>;
    onSubmit: (data: T) => Promise<void> | void;
    onCancel: () => void;
    children: React.ReactNode;
    isEdit?: boolean;
    submitText?: { create: string; update: string };
    loadingText?: { create: string; update: string };
    cancelText?: string;
    className?: string;
    // Advanced features
    customValidationRules?: ValidationRule<T>[];
    performanceConfig?: PerformanceConfig;
    errorBoundary?: boolean;
    validationOptions?: {
        showToast?: boolean;
        focusOnError?: boolean;
    };
}

export function AdvancedForm<T extends FieldValues>({
    initialValues,
    validationSchema,
    onSubmit,
    onCancel,
    children,
    isEdit = false,
    submitText,
    loadingText,
    cancelText,
    className = "space-y-6 p-4",
    customValidationRules = [],
    performanceConfig,
    errorBoundary = true,
    validationOptions
}: AdvancedFormProps<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(validationSchema as any),
        defaultValues: initialValues as any,
        mode: 'onBlur', // Validate on blur for better UX
    });

    const [isPending, startTransition] = useTransition();

    // Advanced validation
    const { validateForm } = useAdvancedValidation(
        methods,
        customValidationRules,
        validationOptions
    );

    // Performance monitoring
    const { recordSubmission } = useFormPerformanceMonitoring(
        isEdit ? 'edit-form' : 'create-form',
        performanceConfig
    );

    const handleSubmit = methods.handleSubmit((data: T) => {
        startTransition(async () => {
            try {
                await recordSubmission(
                    async () => await Promise.resolve(onSubmit(data)),
                    () => validateForm()
                );
            } catch (error) {
                console.error('Form submission error:', error);
                // Error is already handled by the performance monitoring and validation hooks
            }
        });
    });

    const formContent = (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className={className}>
                {children}
                <FormActions
                    onCancel={onCancel}
                    isPending={isPending}
                    isEdit={isEdit}
                    submitText={submitText}
                    loadingText={loadingText}
                    cancelText={cancelText}
                />
            </form>
        </FormProvider>
    );

    // Wrap with error boundary if enabled
    if (errorBoundary) {
        return (
            <ErrorBoundary>
                {formContent}
            </ErrorBoundary>
        );
    }

    return formContent;
}

// Helper function to create a form with preset configurations for common use cases
export function createFormWithPresets<T extends FieldValues>(
    preset: 'basic' | 'advanced' | 'performance-monitored'
) {
    const presetConfigs = {
        basic: {
            errorBoundary: false,
            performanceConfig: { enableLogging: false, enableToasts: false }
        },
        advanced: {
            errorBoundary: true,
            validationOptions: { showToast: true, focusOnError: true },
            performanceConfig: { enableLogging: true, enableToasts: false }
        },
        'performance-monitored': {
            errorBoundary: true,
            validationOptions: { showToast: true, focusOnError: true },
            performanceConfig: {
                enableLogging: true,
                enableToasts: true,
                slowThreshold: 1500
            }
        }
    };

    return (props: Omit<AdvancedFormProps<T>, keyof typeof presetConfigs[typeof preset]>) => (
        <AdvancedForm<T> {...props} {...presetConfigs[preset]} />
    );
}