'use client';

import Loader from '@/components/layout/loader';
import { AssignmentModal } from '@/components/modals/assignment-modal';
import { GradeSubmissionModal } from '@/components/modals/grade-submission-modal';
import { LessonModal } from '@/components/modals/lesson-modal';
import { ModuleModal } from '@/components/modals/module-modal';
import { ViewAllSubmissionsModal } from '@/components/modals/view-all-submission-modal';
import { ViewSubmissionModal } from '@/components/modals/view-submission-modal';
import { useEntityModal } from '@/hooks/common/use-entity-modal';
import { useCourseContext } from '@/hooks/courses/use-course-context';
import { useGetAllSubmissionsByCourse } from '@/hooks/submissions/use-get-all-submission-by-course';
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
    const { data: submissions } = useGetAllSubmissionsByCourse(courseId);

    const {
        course,
        isOwner,
        isEnrolled,
        isLoading,
        courseStats,
        courseStatus
    } = useCourseContext(courseId);

    const {
        open
    } = useEntityModal();

    const handleCreateModule = useCallback(() => {
        open("module", "create");
    }, [open]);

    const handleViewSubmissions = useCallback(() => {
        open("submission", "all", { submissions, isInstructor: isOwner, course });
    }, [open, submissions, isOwner, course]);


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
            <CourseDetailHeader
                courseId={courseId}
                isOwner={isOwner}
                onCreateModule={handleCreateModule}
                onViewSubmissions={handleViewSubmissions}
            />

            <CourseInfoCard
                course={course}
                isOwner={isOwner}
                isEnrolled={isEnrolled}
                totalLessons={courseStats.totalLessons}
                totalAssignments={courseStats.totalAssignments}
            />

            <CourseModulesSection
                modules={course.modules ?? []}
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
            />

            <ViewAllSubmissionsModal
                modalId="view-all-submissions"
            />
            <ViewSubmissionModal
                modalId="view-submission-instructor"
            />
            <GradeSubmissionModal
                modalId="grade-submission"
            />
        </div>
    );
}
