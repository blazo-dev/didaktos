'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { SubmissionForm } from '../forms/submission-form';

interface SubmissionModalProps {
    modalId: string;
    onSuccess?: (submission: any) => void;
}

export function SubmissionModal({ modalId, onSuccess }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = (submission: any) => {
        // Call custom success handler first if provided
        onSuccess?.(submission);
        // Then close modal
        closeModal(modalId);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal
            id={modalId}
            onClose={handleCancel}
        >
            <SubmissionForm
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </Modal>
    );
}