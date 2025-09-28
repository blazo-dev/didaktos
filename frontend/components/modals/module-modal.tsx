'use client';

import { ModuleForm } from '@/components/forms/module-form';
import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { Module } from '@/types/course';

interface ModuleModalProps {
    modalId: string;
    courseId: string;
    onSuccess?: (module: Module) => void;
}

export function ModuleModal({ modalId, courseId, onSuccess }: ModuleModalProps) {
    const { getModal, closeModal } = useModalStore();
    const modal = getModal(modalId);

    // Extract the module data from the modal store
    const moduleData = modal?.data?.module as Module | undefined;

    const handleSuccess = (moduleData: Module) => {
        closeModal(modalId);
        onSuccess?.(moduleData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal
            id={modalId}
            onClose={handleCancel}
        >
            <ModuleForm
                courseId={courseId}
                module={moduleData}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </Modal>
    );
}