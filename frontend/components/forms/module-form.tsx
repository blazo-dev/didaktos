'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateModule } from '@/hooks/modules/use-create-modules';
import { useUpdateModule } from '@/hooks/modules/use-update-module';
import { ModuleFormData, moduleSchema } from '@/lib/schemas/module';
import { Module } from '@/types/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface ModuleFormProps {
    courseId: string;
    module?: Module;
    onSuccess?: (module: Module) => void;
    onCancel?: () => void;
}

export function ModuleForm({ courseId, module, onSuccess, onCancel }: ModuleFormProps) {
    const createModuleMutation = useCreateModule(courseId);
    const updateModuleMutation = useUpdateModule(courseId);

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ModuleFormData>({
        resolver: zodResolver(moduleSchema),
        defaultValues: {
            title: module?.title || '',
        },
    });

    // Handle success with useEffect
    useEffect(() => {
        if (createModuleMutation.isSuccess || updateModuleMutation.isSuccess) {
            reset();
            onSuccess?.(module as Module);
        }
    }, [createModuleMutation.isSuccess, updateModuleMutation.isSuccess, module, onSuccess, reset]);

    const onSubmit = (data: ModuleFormData) => {
        if (module) {
            // Update existing module
            updateModuleMutation.mutate({
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

            createModuleMutation.mutate(newModuleData);
        }
    };

    const isLoading = createModuleMutation.isPending || updateModuleMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
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

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>{module ? 'Updating...' : 'Creating...'}</span>
                        </div>
                    ) : (
                        module ? 'Update Module' : 'Create Module'
                    )}
                </Button>
            </div>
        </form>
    );
}