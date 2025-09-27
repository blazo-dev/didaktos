'use client';

import { SubmissionForm } from '../forms/submission-form';
import { FormModal } from './common/form-modal';

interface SubmissionModalProps {
    modalId: string;
}

export function SubmissionModal({ modalId }: SubmissionModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <SubmissionForm
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                />
            )}
        </FormModal>
    );
}