'use client';

import Loader from '@/components/layout/loader';
import { AssignmentModal } from '@/components/modals/assignment-modal';
import { GradeSubmissionModal } from '@/components/modals/grade-submission-modal';
import { LessonModal } from '@/components/modals/lesson-modal';
import { ModuleModal } from '@/components/modals/module-modal';
import { ViewAllSubmissionsModal } from '@/components/modals/view-all-submission-modal';
import { ViewSubmissionModal } from '@/components/modals/view-submission-modal';
import { useCourseContext } from '@/hooks/courses/use-course-context';
import { useCourseModals } from '@/hooks/courses/use-course-modals';
import { useGetAllSubmissionsByCourse } from '@/hooks/submissions/use-get-all-submission-by-course';
import { useCoursesStore } from '@/stores/courses-store';
import { useCallback } from 'react';
import { CourseDetailHeader } from './course-detail-header';
import { CourseInfoCard } from './course-info-card';
import { CourseModulesSection } from './course-modules-section';
import { CourseNotFound } from './course-not-found';


interface CourseDetailViewProps {
    courseId: string;
    useFakeData?: boolean;
}

export function CourseDetailView({ courseId }: CourseDetailViewProps) {
    const { currentModule } = useCoursesStore();
    const { data: submissions } = useGetAllSubmissionsByCourse(courseId);

    // Use new state management hooks
    const {
        course,
        isOwner,
        isEnrolled,
        isLoading,
        courseStats,
        permissions,
        courseStatus
    } = useCourseContext(courseId);

    const {
        openCreateModule,
        openViewAllSubmissions
    } = useCourseModals(courseId);

    // Handle modal actions with new hooks
    const handleCreateModule = useCallback(() => {
        openCreateModule();
    }, [openCreateModule]);

    const handleViewSubmissions = useCallback(() => {
        if (submissions) {
            openViewAllSubmissions(submissions, undefined, 'All Submissions');
        }
    }, [submissions, openViewAllSubmissions]);

    // Handle grading success
    const handleGradingSuccess = useCallback(() => {
        // The submission data will be automatically refreshed via React Query
        // No manual state management needed
    }, []);

    // Handle loading and error states using courseStatus
    if (isLoading || courseStatus.status === 'loading') {
        return <Loader text="Loading course..." />;
    }

    if (courseStatus.status === 'not-found') {
        return <CourseNotFound type="not-found" />;
    }

    if (courseStatus.status === 'access-denied') {
        return <CourseNotFound type="access-denied" />;
    }

    if (!course) {
        return <CourseNotFound type="not-found" />;
    }

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8'>
            {/* No more prop drilling! Components get data from context */}
            <CourseDetailHeader
                courseId={courseId}
                isOwner={isOwner}
                onCreateModule={handleCreateModule}
                onViewSubmissions={handleViewSubmissions}
            />

            {/* Use courseStats from context instead of manual calculation */}
            <CourseInfoCard
                course={course}
                isOwner={isOwner}
                isEnrolled={isEnrolled}
                totalLessons={courseStats.totalLessons}
                totalAssignments={courseStats.totalAssignments}
            />

            <CourseModulesSection
                modules={course.modules}
                courseId={course.id}
                isOwner={isOwner}
                isEnrolled={isEnrolled}
                onCreateModule={handleCreateModule}
            />
            {/* Lesson Modals */}
            <LessonModal
                modalId="create-lesson"
            />

            {/* Assignment Modals */}
            <AssignmentModal
                modalId="create-assignment"
            />

            {/* Modules Modal */}
            <ModuleModal
                modalId={"create-module"}
                courseId={course.id}
            />
            <ModuleModal
                modalId={"edit-module"}
                courseId={course.id}
                module={currentModule!}
            />

            <ViewAllSubmissionsModal
                modalId="view-all-submissions"
                submissions={submissions || []}
            />
            <ViewSubmissionModal
                modalId="view-submission-instructor"
            />
            <GradeSubmissionModal
                modalId="grade-submission"
                onSuccess={handleGradingSuccess}
            />
        </div>
    );
}
