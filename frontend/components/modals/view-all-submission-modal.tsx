'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { Submission } from '@/types/course';
import ViewAllSubmissions from '../views/submissions/view-all-submissions';

interface ViewAllSubmissionsModalProps {
    modalId: string;
    submissions: Submission[];
}

export function ViewAllSubmissionsModal({ modalId, submissions }: ViewAllSubmissionsModalProps) {
    const { closeModal } = useModalStore();

    return (
        <Modal
            id={modalId}
            onClose={() => closeModal(modalId)}
        >
            <ViewAllSubmissions submissions={submissions} />
        </Modal>
    );
}