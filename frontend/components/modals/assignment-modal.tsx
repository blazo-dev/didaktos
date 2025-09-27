'use client';

import { Assignment } from '@/types/course';
import { AssignmentForm } from '@/components/forms/assignment-form';
import { FormModal } from './common/form-modal';

interface AssignmentModalProps {
    modalId: string;
    assignment?: Assignment;
    onSuccess?: (assignment: Assignment) => void;
}

export function AssignmentModal({ modalId, assignment, onSuccess }: AssignmentModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <AssignmentForm 
                    assignment={assignment} 
                    onCancel={handleCancel} 
                    onSuccess={(assignmentData) => {
                        handleSuccess();
                        onSuccess?.(assignmentData);
                    }} 
                />
            )}
        </FormModal>
    );
}