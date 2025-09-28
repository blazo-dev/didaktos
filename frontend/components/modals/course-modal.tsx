'use client';

import { CourseForm } from '@/components/forms/course-form';
import { useModalStore } from '@/stores/ui-store';
import { Course } from '@/types/course';
import { FormModal } from './common/form-modal';

interface CourseModalProps {
    modalId: string;
    onSuccess?: (course: Course) => void;
}

export function CourseModal({ modalId, onSuccess }: CourseModalProps) {
    const { getModal } = useModalStore();
    const modal = getModal(modalId);

    // Extract the course data from the modal store
    const courseData = modal?.data as Course | undefined;

    console.log({ modalId, modal, courseData });

    return (
        <FormModal modalId={modalId}>
            {({ handleSuccess, handleCancel }) => (
                <CourseForm
                    course={courseData}
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