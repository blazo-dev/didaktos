'use client';

import { AssignmentModal } from '@/components/modals/assignment-modal';
import { SubmissionModal } from '@/components/modals/submission-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDeleteAssignment } from '@/hooks/assignments/use-delete-assignment';
import { useAuthStore } from '@/stores/auth-store';
import { useCoursesStore } from '@/stores/courses-store';
import { useModalStore } from '@/stores/modal-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AssignmentHeader from './assignment-header';

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

    const handleOpenSubmission = () => {
        openModal({
            id: 'create-submission',
            title: 'Create Submission',
            closable: true,
            backdrop: true,
            size: 'xl',
        });
    }

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8 relative'>

            {/* Assignment Header */}
            <AssignmentHeader
                courseId={courseId}
                isOwner={isOwner}
                onAssignmentEdit={handleAssignmentEdit}
                onAssignmentDelete={handleAssignmentDelete}
                onAssignmentSubmit={handleOpenSubmission}
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
            <SubmissionModal
                modalId="create-submission"
            />
        </div>
    );
}