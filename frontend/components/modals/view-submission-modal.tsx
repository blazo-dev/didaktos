'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import ViewSubmission from '../views/submissions/view-submissions';

interface SubmissionModalProps {
    modalId: string;
}

export function ViewSubmissionModal({ modalId }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <ViewSubmission />
        </Modal>
    );
}