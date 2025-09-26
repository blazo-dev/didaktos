'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { Submission } from '@/types/course';
import ViewAllSubmissions from '../views/submissions/view-all-submissions';

interface SubmissionModalProps {
    modalId: string;
    submissions: Submission[];

}

export function ViewAllSubmissionsModal({ modalId, submissions }: SubmissionModalProps) {
    const { closeModal } = useModalStore();

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <ViewAllSubmissions submissions={submissions} />
        </Modal>
    );
}