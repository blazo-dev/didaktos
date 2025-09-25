'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useState } from 'react';
import { useAuth } from '../../../../hooks/auth/use-auth';
import { useCourse } from '../../../../hooks/courses/use-course';
import Loader from '../../../layout/loader';
import { FAKE_COURSE } from '../fake-course-data';
import { CourseDetailHeader } from './course-detail-header';
import { CourseInfoCard } from './course-info-card';
import { CourseModulesSection } from './course-modules-section';
import { CourseNotFound } from './course-not-found';

interface CourseDetailViewProps {
    courseId: string;
    useFakeData?: boolean; // Optional prop to use fake data for testing
}

export function CourseDetailView({ courseId, useFakeData = false }: CourseDetailViewProps) {
    const { user } = useAuth();
    const { data: courseData, isLoading } = useCourse(courseId);
    const [showCreateModule, setShowCreateModule] = useState(false);

    // Use fake data if useFakeData prop is true, otherwise use real data
    const course = useFakeData ? FAKE_COURSE : courseData;

    // Check if current user is the owner/creator of this course
    const isOwner = course?.instructor.id === user?.id;

    // Check if current user is enrolled as a student
    const isEnrolled = course?.students.some(student => student.id === user?.id) ?? false;

    // User can view course if they are the owner or enrolled
    const canView = isOwner || isEnrolled || true;

    if (!useFakeData && isLoading) {
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
        <AppLayout showSidebar showHeader>
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
                {/* TODO: Add Create Module Modal */}
                {/*
                      {showCreateModule && (
                <CreateModuleModal
                  courseId={courseId}
                  isOpen={showCreateModule}
                  onClose={() => setShowCreateModule(false)}
                />
                      )}
                      */}
            </div>
        </AppLayout>
    );
}

/*
 * Usage Examples:
 * 
 * // Standard usage with real API data
 * <CourseDetailView courseId="course-123" />
 * 
 * // Development/testing with fake data
 * <CourseDetailView courseId="any-id" useFakeData={true} />
 * 
 * // Import individual components for custom layouts
 * import { 
 *   CourseDetailHeader, 
 *   CourseInfoCard, 
 *   CourseModulesSection 
 * } from './components/views/courses';
 */