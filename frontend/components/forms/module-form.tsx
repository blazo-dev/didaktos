'use client';

import { Input } from '@/components/ui/input';
import { useCreateModule } from '@/hooks/modules/use-create-modules';
import { useUpdateModule } from '@/hooks/modules/use-update-module';
import { ModuleFormData, moduleSchema } from '@/lib/schemas/module';
import { Module } from '@/types/course';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { BaseForm } from './common/base-form';

interface ModuleFormProps {
    courseId: string;
    module?: Module;
    onSuccess?: (module: Module) => void;
    onCancel?: () => void;
}

function ModuleFormFields() {
    const { register, formState: { errors } } = useFormContext<ModuleFormData>();

    return (
        <>
            {/* Module Title */}
            <Input
                id="module-title"
                label="Module Title"
                placeholder="Enter module title"
                type="text"
                required
                register={register("title")}
                error={errors.title?.message}
            />
        </>
    );
}

export function ModuleForm({ courseId, module, onSuccess, onCancel }: ModuleFormProps) {
    const createModuleMutation = useCreateModule(courseId);
    const updateModuleMutation = useUpdateModule(courseId);

    // Handle success with useEffect
    useEffect(() => {
        if (createModuleMutation.isSuccess || updateModuleMutation.isSuccess) {
            const resultModule = createModuleMutation.data || updateModuleMutation.data || module;
            onSuccess?.(resultModule as Module);
        }
    }, [createModuleMutation.isSuccess, updateModuleMutation.isSuccess, createModuleMutation.data, updateModuleMutation.data, module, onSuccess]);

    const handleSubmit = async (data: ModuleFormData) => {
        if (module) {
            // Update existing module
            await updateModuleMutation.mutateAsync({
                moduleId: module.id,
                data: data,
            });
        } else {
            // Create new module
            const newModuleData = {
                ...data,
                lessons: [],
                assignments: [],
            };

            await createModuleMutation.mutateAsync(newModuleData);
        }
    };

    return (
        <BaseForm<ModuleFormData>
            initialValues={{
                title: module?.title || '',
            }}
            validationSchema={moduleSchema}
            onSubmit={handleSubmit}
            onCancel={onCancel || (() => { })}
            isEdit={!!module}
            submitText={{ create: 'Create Module', update: 'Update Module' }}
            loadingText={{ create: 'Creating...', update: 'Updating...' }}
        >
            <ModuleFormFields />
        </BaseForm>
    );
}