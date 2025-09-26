'use client';

import { ModuleForm } from '@/components/forms/module-form';
import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { Module } from '@/types/course';

interface ModuleModalProps {
    modalId: string;
    courseId: string;
    module?: Module;
    onSuccess?: (module: Module) => void;
}

export function ModuleModal({ modalId, courseId, module, onSuccess }: ModuleModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = (moduleData: Module) => {
        closeModal(modalId);
        onSuccess?.(moduleData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <ModuleForm
                courseId={courseId}
                module={module}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </Modal>
    );
}