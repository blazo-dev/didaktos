'use client';

import { LessonForm } from '@/components/forms/lesson-form';
import { Lesson } from '@/types/course';
import { FormModal } from './common/form-modal';

interface LessonModalProps {
    modalId: string;
    lesson?: Lesson;
    onSuccess?: (lesson: Lesson) => void;
}

export function LessonModal({ modalId, lesson, onSuccess }: LessonModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <LessonForm
                    lesson={lesson}
                    onCancel={handleCancel}
                    onSuccess={(lessonData) => {
                        handleSuccess();
                        onSuccess?.(lessonData);
                    }}
                />
            )}
        </FormModal>
    );
}