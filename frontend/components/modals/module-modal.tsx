'use client';

import { ModuleForm } from '@/components/forms/module-form';
import { useModalStore } from '@/stores/ui-store';
import { Module } from '@/types/course';
import { FormModal } from './common/form-modal';

interface ModuleModalProps {
    modalId: string;
    courseId: string;
    onSuccess?: (module: Module) => void;
}

export function ModuleModal({ modalId, courseId, onSuccess }: ModuleModalProps) {
    const { getModal } = useModalStore();
    const modal = getModal(modalId);

    // Extract the module data from the modal store
    const moduleData = modal?.data?.module as Module | undefined;

    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <ModuleForm
                    courseId={courseId}
                    module={moduleData}
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