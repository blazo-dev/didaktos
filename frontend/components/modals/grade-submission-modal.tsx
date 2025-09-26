'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { GradeSubmissionForm } from '../forms/grade-submission-form';

interface SubmissionModalProps {
    modalId: string;
    onSuccess?: () => void;
}

export function GradeSubmissionModal({ modalId, onSuccess }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = () => {
        closeModal(modalId);
        onSuccess?.();
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <GradeSubmissionForm onCancel={handleCancel} onSuccess={handleSuccess} />
        </Modal>
    );
}