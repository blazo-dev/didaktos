'use client';

import { CourseForm } from '@/components/forms/course-form';
import { Course } from '@/types/course';
import { FormModal } from './common/form-modal';

interface CourseModalProps {
    modalId: string;
    course?: Course;
    onSuccess?: (course: Course) => void;
}

export function CourseModalRefactored({ modalId, course, onSuccess }: CourseModalProps) {
    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <CourseForm
                    course={course}
                    onSuccess={(courseData) => {
                        handleSuccess();
                        onSuccess?.(courseData);
                    }}
                    onCancel={handleCancel}
                />
            )}
        </FormModal>
    );
}