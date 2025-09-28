'use client';

import { Input } from '@/components/ui/input';
import { useCreateModule, useUpdateModule } from '@/hooks/modules/use-module-crud';
import { ModuleFormData, moduleSchema } from '@/lib/schemas/module';
import { Module } from '@/types/course';
import { useFormContext } from 'react-hook-form';
import { BaseForm } from './common/base-form';

interface ModuleFormProps {
    courseId: string;
    module?: Module;
    onSuccess: (module: Module) => void;
    onCancel: () => void;
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

    const handleSubmit = async (data: ModuleFormData) => {
        if (module) {
            // Update existing module
            await updateModuleMutation.mutateAsync({
                moduleId: module.id,
                data: data,
            }, { onSuccess: onSuccess });
        } else {
            // Create new module
            const newModuleData = {
                ...data,
                lessons: [],
                assignments: [],
            };

            await createModuleMutation.mutateAsync(newModuleData, { onSuccess: onSuccess });
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