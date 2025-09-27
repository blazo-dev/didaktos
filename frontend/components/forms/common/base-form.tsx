'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { FormActions } from './form-actions';

interface BaseFormProps<T extends FieldValues> {
  initialValues?: Partial<T>;
  validationSchema: ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel: () => void;
  children: React.ReactNode;
  isEdit?: boolean;
  submitText?: { create: string; update: string };
  loadingText?: { create: string; update: string };
  cancelText?: string;
  className?: string;
}

export function BaseForm<T extends FieldValues>({
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  children,
  isEdit = false,
  submitText,
  loadingText,
  cancelText,
  className = "space-y-6 p-4"
}: BaseFormProps<T>) {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues as any,
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = methods.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await onSubmit(data as T);
      } catch (error) {
        // Error handling is managed by the individual hooks
        console.error('Form submission error:', error);
      }
    });
  });

  return (
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
}