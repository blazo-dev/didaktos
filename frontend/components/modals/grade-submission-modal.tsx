'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { GradeSubmissionForm } from '../forms/grade-submission-form';

interface SubmissionModalProps {
    modalId: string;
}

export function GradeSubmissionModal({ modalId }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = () => {
        closeModal(modalId);
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