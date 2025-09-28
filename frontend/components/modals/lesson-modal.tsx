'use client';

import { LessonForm } from '@/components/forms/lesson-form';
import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { Lesson } from '@/types/course';

interface LessonModalProps {
    modalId: string;
    onSuccess?: (lesson: Lesson) => void;
}

export function LessonModal({ modalId, onSuccess }: LessonModalProps) {

    const { getModal, closeModal } = useModalStore();
    const modal = getModal(modalId);

    // Extract the lesson data from the modal store
    const lessonData = modal?.data?.lesson as Lesson | undefined;
    const moduleId = modal?.data?.moduleId as string | undefined;

    const handleSuccess = (lessonData: Lesson) => {
        closeModal(modalId);
        onSuccess?.(lessonData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal
            id={modalId}
            onClose={handleCancel}
        >
            <LessonForm
                lesson={lessonData}
                moduleId={moduleId}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </Modal>
    );
}