'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/modal-store';
import { Lesson } from '@/types/course';
import { LessonForm } from '../forms/lesson-form';

interface CourseModalProps {
    modalId: string;
    lesson?: Lesson;
    onSuccess?: (lesson: Lesson) => void;
}

export function LessonModal({ modalId, lesson, onSuccess }: CourseModalProps) {
    const { closeModal } = useModalStore();

    const handleSuccess = (lessonData: Lesson) => {
        closeModal(modalId);
        onSuccess?.(lessonData);
    };

    const handleCancel = () => {
        closeModal(modalId);
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <LessonForm lesson={lesson} onCancel={handleCancel} onSuccess={handleSuccess} />
        </Modal>
    );
}