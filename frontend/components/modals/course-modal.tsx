'use client';

import { CourseForm } from '@/components/forms/course-form';
import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { Course } from '@/types/course';

interface CourseModalProps {
    modalId: string;
    course?: Course;
    onSuccess?: (course: Course) => void;
}

export function CourseModal({ modalId, course, onSuccess }: CourseModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = (courseData: Course) => {
        closeModal(modalId);
        onSuccess?.(courseData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <CourseForm
                course={course}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </Modal>
    );
}