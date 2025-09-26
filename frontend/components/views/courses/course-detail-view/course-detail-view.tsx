'use client';

import Loader from '@/components/layout/loader';
import { AssignmentModal } from '@/components/modals/assignment-modal';
import { GradeSubmissionModal } from '@/components/modals/grade-submission-modal';
import { LessonModal } from '@/components/modals/lesson-modal';
import { ModuleModal } from '@/components/modals/module-modal';
import { ViewAllSubmissionsModal } from '@/components/modals/view-all-submission-modal';
import { ViewSubmissionModal } from '@/components/modals/view-submission-modal';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import { useGetAllSubmissionsByCourse } from '@/hooks/submissions/use-get-all-submission-by-course';
import { useCoursesStore } from '@/stores/courses-store';
import { useModalStore } from '@/stores/modal-store';
import { CourseDetailHeader } from './course-detail-header';
import { CourseInfoCard } from './course-info-card';
import { CourseModulesSection } from './course-modules-section';
import { CourseNotFound } from './course-not-found';


interface CourseDetailViewProps {
    courseId: string;
    useFakeData?: boolean;
}

export function CourseDetailView({ courseId }: CourseDetailViewProps) {
    const { course, isOwner, isEnrolled, isLoading } = useCourseById(courseId);
    const { currentModule, setCurrentSubmissions } = useCoursesStore();
    const { data: submissions } = useGetAllSubmissionsByCourse(courseId);
    const { openModal } = useModalStore();

    // User can view course if they are the owner or enrolled
    const canView = isOwner || isEnrolled;

    if (isLoading) {
        return <Loader text="Loading course..." />;
    }

    if (!course) {
        return <CourseNotFound type="not-found" />;
    }

    if (!canView) {
        return <CourseNotFound type="access-denied" />;
    }



    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const totalAssignments = course.modules.reduce((acc, module) => acc + module.assignments.length, 0);

    const handleCreateModule = () => {
        openModal({
            id: "create-module",
            title: "Create Module",
        });
    };

    const handleViewSubmissions = () => {
        setCurrentSubmissions(submissions || []);

        openModal({
            id: 'view-all-submissions',
            title: 'All Submissions',
            closable: true,
            backdrop: true,
            size: 'xl',
        });

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
                totalLessons={totalLessons}
                totalAssignments={totalAssignments}
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
                onSuccess={() => {
                    setCurrentSubmissions(submissions || []);
                }}
            />
        </div>
    );
}
