'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { Assignment } from '@/types/course';
import { AssignmentForm } from '@/components/forms/assignment-form';

interface CourseModalProps {
    modalId: string;
    assignment?: Assignment;
    onSuccess?: (assignment: Assignment) => void;
}

export function AssignmentModal({ modalId, assignment, onSuccess }: CourseModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = (assignmentData: Assignment) => {
        closeModal(modalId);
        onSuccess?.(assignmentData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <AssignmentForm assignment={assignment} onCancel={handleCancel} onSuccess={handleSuccess} />
        </Modal>
    );
}