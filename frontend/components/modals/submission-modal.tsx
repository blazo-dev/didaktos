'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { SubmissionForm } from '../forms/submission-form';

interface SubmissionModalProps {
    modalId: string;
}

export function SubmissionModal({ modalId }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = () => {
        closeModal(modalId);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <SubmissionForm onCancel={handleCancel} onSuccess={handleSuccess} />
        </Modal>
    );
}