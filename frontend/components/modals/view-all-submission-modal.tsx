'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import ViewAllSubmissions from '../views/submissions/view-all-submissions';

interface SubmissionModalProps {
    modalId: string;
}

export function ViewAllSubmissionsModal({ modalId }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <ViewAllSubmissions />
        </Modal>
    );
}