'use client';

import { AssignmentForm } from '@/components/forms/assignment-form';
import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { Assignment } from '@/types/course';

interface AssignmentModalProps {
    modalId: string;
    onSuccess?: (assignment: Assignment) => void;
}

export function AssignmentModal({ modalId, onSuccess }: AssignmentModalProps) {
    const { getModal, closeModal } = useModalStore();
    const modal = getModal(modalId);


    // Extract the assignment data from the modal store
    const assignmentData = modal?.data?.assignment as Assignment | undefined;
    const moduleId = modal?.data?.moduleId as string | undefined;


    const handleSuccess = (assignmentData: Assignment) => {
        closeModal(modalId);
        onSuccess?.(assignmentData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal
            id={modalId}
            onClose={handleCancel}
        >
            <AssignmentForm
                assignment={assignmentData}
                moduleId={moduleId}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </Modal>
    );
}