'use client';

import { AppLayout } from "@/components/layout/app-layout";
import Loader from "@/components/layout/loader";
import { useCourses } from "@/hooks/courses/use-courses";
import { useEnrollments } from "@/hooks/enrollments/use-enrollments";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";
import { CoursesFilters, FilterType } from "./courses-filters";
import { CoursesGrid } from "./courses-grid";
import { CoursesHeader } from "./courses-header";

export function CoursesLayout() {
    const { user } = useAuthStore();
    const { data: maybeCourses, isLoading } = useCourses();
    const courses = maybeCourses || [];
    const { data: maybeEnrollments } = useEnrollments();
    const enrollments = maybeEnrollments || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [filterType, setFilterType] = useState<FilterType>('all');

    // Filter courses based on user relationship and search term
    const filteredCourses = courses.filter(course => {
        // Text search filter
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Relationship filter
        const isOwner = course.instructor.id === user?.id;
        const isEnrolled = true;

        switch (filterType) {
            case 'owned':
                return isOwner;
            case 'enrolled':
                return isEnrolled && !isOwner; // Only show courses where user is enrolled but not owner
            case 'all':
            default:
                return isOwner || isEnrolled;
        }
    });

    // Count different types of courses
    const ownedCoursesCount = courses.filter(course => course.instructor.id === user?.id).length || 0;
    const enrolledCoursesCount = enrollments.filter(enrollment =>
        enrollment.studentId === user?.id
    ).length || 0;

    const handleCreateCourse = () => setShowCreateModal(true);
    const handleEnrollCourse = () => setShowEnrollModal(true);

    if (isLoading) {
        return <Loader text="Loading courses..." />;
    }

    return (
        <AppLayout showSidebar showHeader>
            <div className="p-6 space-y-6">
                <CoursesHeader
                    ownedCoursesCount={ownedCoursesCount}
                    enrolledCoursesCount={enrolledCoursesCount}
                    onCreateCourse={handleCreateCourse}
                    onEnrollCourse={handleEnrollCourse}
                />

                <CoursesFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterType={filterType}
                    onFilterChange={setFilterType}
                    ownedCoursesCount={ownedCoursesCount}
                    enrolledCoursesCount={enrolledCoursesCount}
                />

                <CoursesGrid
                    courses={filteredCourses}
                    searchTerm={searchTerm}
                    filterType={filterType}
                    onCreateCourse={handleCreateCourse}
                    onEnrollCourse={handleEnrollCourse}
                />

                {/* TODO: Add Modals */}
                {/* 
                {showCreateModal && (
                    <CreateCourseModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
                {showEnrollModal && (
                    <EnrollCourseModal
                        isOpen={showEnrollModal}
                        onClose={() => setShowEnrollModal(false)}
                    />
                )}
                */}
            </div>
        </AppLayout>
    );
}