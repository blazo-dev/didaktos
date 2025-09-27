'use client';

import { SubmissionForm } from '../forms/submission-form';
import { FormModal } from './common/form-modal';

interface SubmissionModalProps {
    modalId: string;
    onSuccess?: (submission: any) => void;
}

export function SubmissionModal({ modalId, onSuccess }: SubmissionModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <SubmissionForm
                    onCancel={handleCancel}
                    onSuccess={(submission) => {
                        // Call custom success handler first if provided
                        onSuccess?.(submission);
                        // Then call the default FormModal success handler to close modal
                        handleSuccess();
                    }}
                />
            )}
        </FormModal>
    );
}