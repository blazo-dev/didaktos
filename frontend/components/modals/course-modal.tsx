'use client';

import { CourseForm } from '@/components/forms/course-form';
import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { Course } from '@/types/course';

interface CourseModalProps {
    modalId: string;
    onSuccess?: (course: Course) => void;
}

export function CourseModal({ modalId, onSuccess }: CourseModalProps) {
    const { getModal, closeModal } = useModalStore();
    const modal = getModal(modalId);

    // Extract the course data from the modal store
    const courseData = modal?.data?.course as Course | undefined;

    const handleSuccess = (courseData: Course) => {
        closeModal(modalId);
        onSuccess?.(courseData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal
            id={modalId}
            onClose={handleCancel}
        >
            <CourseForm
                course={courseData}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </Modal>
    );
}