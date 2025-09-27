'use client';

import { GradeSubmissionForm } from '../forms/grade-submission-form';
import { FormModal } from './common/form-modal';

interface GradeSubmissionModalProps {
    modalId: string;
    onSuccess?: () => void;
}

export function GradeSubmissionModal({ modalId, onSuccess }: GradeSubmissionModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <GradeSubmissionForm
                    onCancel={handleCancel}
                    onSuccess={() => {
                        handleSuccess();
                        onSuccess?.();
                    }}
                />
            )}
        </FormModal>
    );
}