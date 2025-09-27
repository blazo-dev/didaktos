'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import ViewSubmission from '../views/submissions/view-submissions';

interface ViewSubmissionModalProps {
    modalId: string;
}

export function ViewSubmissionModal({ modalId }: ViewSubmissionModalProps) {
    const { closeModal } = useModalStore();

    return (
        <Modal
            id={modalId}
            onClose={() => closeModal(modalId)}
        >
            <ViewSubmission />
        </Modal>
    );
}