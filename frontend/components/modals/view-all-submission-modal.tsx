'use client';

import { Modal } from '@/components/ui/modal';
import { useModalStore } from '@/stores/ui-store';
import { Course, Submission } from '@/types/course';
import ViewAllSubmissions from '../views/submissions/view-all-submissions';

interface ViewAllSubmissionsModalProps {
    modalId: string;
}

export function ViewAllSubmissionsModal({ modalId }: ViewAllSubmissionsModalProps) {
    const { getModal, closeModal } = useModalStore();
    const modal = getModal(modalId);

    // Extract the lesson data from the modal store
    const submissionsData = modal?.data?.submissions as Submission[] | undefined;
    const isInstructor = modal?.data?.isInstructor as boolean | undefined;
    const courseData = modal?.data?.course as Course | undefined;

    return (
        <Modal
            id={modalId}
            onClose={() => closeModal(modalId)}
        >
            <ViewAllSubmissions submissions={submissionsData ?? []} isInstructor={!!isInstructor} course={courseData} />
        </Modal>
    );
}