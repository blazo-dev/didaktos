'use client';

import { AssignmentModal } from '@/components/modals/assignment-modal';
import { SubmissionModal } from '@/components/modals/submission-modal';
import { ViewSubmissionModal } from '@/components/modals/view-submission-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAssignmentActions } from '@/hooks/assignments/use-assignment-actions';
import { useDeleteAssignment } from '@/hooks/assignments/use-delete-assignment';
import { useConfirmationDialog } from '@/hooks/common/use-confirmation-dialog';
import { useCourseContext } from '@/hooks/courses/use-course-context';
import { useCourseModals } from '@/hooks/courses/use-course-modals';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import AssignmentHeader from './assignment-header';

interface AssignmentViewProps {
    courseId: string;
}


export function AssignmentView({ courseId }: AssignmentViewProps) {
    const router = useRouter();
    const { confirmDeletion } = useConfirmationDialog();
    const deleteAssignment = useDeleteAssignment();

    // Use new state management hooks
    const { course, user, permissions, isOwner } = useCourseContext(courseId);
    const { currentAssignment, updateAssignmentWithSubmission } = useAssignmentActions();
    const { openEditAssignment, openCreateSubmission, openViewSubmission } = useCourseModals(courseId);

    // Define callbacks before early returns
    const handleAssignmentEdit = useCallback(() => {
        if (currentAssignment) {
            openEditAssignment(currentAssignment);
        }
    }, [currentAssignment, openEditAssignment]);

    const handleAssignmentDelete = useCallback(async () => {
        if (currentAssignment) {
            const confirmed = await confirmDeletion(currentAssignment.title, "assignment");
            if (confirmed) {
                await deleteAssignment.mutateAsync(currentAssignment.id);
                router.push(`/courses/${courseId}`);
            }
        }
    }, [currentAssignment, confirmDeletion, deleteAssignment, router, courseId]);

    const handleOpenSubmission = useCallback(() => {
        if (!currentAssignment) return;

        const existingSubmission = currentAssignment.submissions?.[0];
        if (existingSubmission) {
            openViewSubmission(existingSubmission, currentAssignment, 'student');
        } else {
            openCreateSubmission(currentAssignment);
        }
    }, [currentAssignment, openViewSubmission, openCreateSubmission]);

    const handleSubmissionSuccess = useCallback((newSubmission: any) => {
        if (currentAssignment) {
            updateAssignmentWithSubmission(currentAssignment, newSubmission);
        }
    }, [currentAssignment, updateAssignmentWithSubmission]);

    // Early returns after all hooks
    if (!currentAssignment || !course) {
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

    const existingSubmission = currentAssignment.submissions?.[0];


    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8 relative'>

            {/* Assignment Header */}
            <AssignmentHeader
                courseId={courseId}
                isOwner={isOwner}
                isAlreadySubmitted={Boolean(existingSubmission)}
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
                onSuccess={handleSubmissionSuccess}
            />
            <ViewSubmissionModal
                modalId="view-submission-student"
            />
        </div>
    );
}