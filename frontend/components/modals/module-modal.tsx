'use client';

import { ModuleForm } from '@/components/forms/module-form';
import { Module } from '@/types/course';
import { FormModal } from './common/form-modal';

interface ModuleModalProps {
    modalId: string;
    courseId: string;
    module?: Module;
    onSuccess?: (module: Module) => void;
}

export function ModuleModal({ modalId, courseId, module, onSuccess }: ModuleModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <ModuleForm
                    courseId={courseId}
                    module={module}
                    onSuccess={(moduleData) => {
                        handleSuccess();
                        onSuccess?.(moduleData);
                    }}
                    onCancel={handleCancel}
                />
            )}
        </FormModal>
    );
}