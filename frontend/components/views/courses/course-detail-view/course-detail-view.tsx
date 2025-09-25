'use client';

import { LessonModal } from '@/components/modals/lesson-modal';
import { useCourseById } from '@/hooks/courses/use-course-by-id';
import { useCoursesStore } from '@/stores/courses-store';
import { useState } from 'react';
import Loader from '../../../layout/loader';
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
    const [showCreateModule, setShowCreateModule] = useState(false);
    const { currentLesson } = useCoursesStore();


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

    return (
        <div className='w-full space-y-4 px-4 sm:px-6 lg:px-8 py-8'>
            <CourseDetailHeader
                courseId={courseId}
                isOwner={isOwner}
                onCreateModule={() => setShowCreateModule(true)}
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
                onCreateModule={() => setShowCreateModule(true)}
            />
            {/* Lesson Modals */}
            <LessonModal
                modalId="create-lesson"
            />
        </div>
    );
}