'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useCoursesStore } from '@/stores/courses-store';
import { useModalStore } from '@/stores/modal-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudyAssistant } from '../assistant/study-assistant';
import AssignmentHeader from './assignment-header';
import { useDeleteAssignment } from '@/hooks/assignments/use-delete-assignment';
import { AssignmentModal } from '@/components/modals/assignment-modal';

interface AssignmentViewProps {
    courseId: string;
}


export function AssignmentView({ courseId }: AssignmentViewProps) {
    const { currentCourse, currentAssignment } = useCoursesStore();

    if (!currentAssignment || !currentCourse) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Assignment not found</h2>
                <p className="text-muted-foreground mb-4">
                    The assignment you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button asChild>
                    <Link href="/courses">Back to Courses</Link>
                </Button>
            </div>
        );
    }

    const deleteAssignment = useDeleteAssignment(currentAssignment.moduleId);
    const router = useRouter();

    const { openModal } = useModalStore();
    const { user } = useAuthStore();

    const isOwner = currentCourse.instructor.id === user?.id;

    const handleAssignmentEdit = () => {
        openModal({
            id: 'edit-assignment',
            title: 'Edit Assignment',
            closable: true,
            backdrop: true,
            size: 'md',
        })

    }

    const handleAssignmentDelete = async () => {

        if (
            confirm(
                'Are you sure you want to delete this assignment? This action cannot be undone.',
            )
        ) {
            await deleteAssignment.mutateAsync(currentAssignment.id);
            router.push(`/courses/${courseId}`);
        }

    }

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8 relative'>

            {/* Assignment Header */}
            <AssignmentHeader
                courseId={courseId}
                isOwner={isOwner}
                onAssignmentEdit={handleAssignmentEdit}
                onAssignmentDelete={handleAssignmentDelete}
            />

            {/* Assignment Content */}
            <Card className="p-0 gap-0">
                <div className="p-6 border-b border-surface-border">
                    <h1 className="text-3xl font-bold">{currentAssignment.title}</h1>
                    <p className="text-muted-foreground">Due {new Date(currentAssignment.dueDate).toLocaleDateString()}</p>
                </div>

                <div className="p-6">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentAssignment.description }}
                    />
                </div>
            </Card>
            <AssignmentModal
                modalId="edit-assignment"
                assignment={currentAssignment}
            />
            <StudyAssistant />
        </div>
    );
}