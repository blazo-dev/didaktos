'use client';

import { AppLayout } from "@/components/layout/app-layout";
import Loader from "@/components/layout/loader";
import { CourseModal } from "@/components/modals/course-modal";
import { useCourses } from "@/hooks/courses/use-courses";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useModalStore } from "@/stores/modal-store";
import { useState } from "react";
import { CoursesFilters, FilterType } from "./courses-filters";
import { CoursesGrid } from "./courses-grid";
import { CoursesHeader } from "./courses-header";

export function CoursesLayout() {
    const { user } = useAuthStore();
    const { openModal } = useModalStore();
    const { currentCourse } = useCoursesStore();
    const { data: maybeCourses, isLoading } = useCourses();
    const courses = maybeCourses || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');

    // Filter courses based on user relationship and search term
    const filteredCourses = courses.filter(course => {
        // Text search filter
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Relationship filter
        const isOwner = course.instructor.id === user?.id;
        const isEnrolled = course.enrollments.includes(user?.id || "");


        switch (filterType) {
            case 'owned':
                return isOwner;
            case 'enrolled':
                return isEnrolled && !isOwner; // Only show courses where user is enrolled but not owner
            case 'all':
            default:
                return true;
        }
    });

    // Count different types of courses
    const ownedCoursesCount = courses.filter(course => course.instructor.id === user?.id).length || 0;
    const enrolledCoursesCount = courses.filter(course =>
        course.enrollments.includes(user!.id)
    ).length || 0;

    const handleCreateCourse = () => {
        openModal({
            id: 'create-course',
            title: 'Create New Course',
            size: 'md',
            closable: true,
            backdrop: true,
        });
    };

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
                />
            </div>

            {/* Course Modals */}
            <CourseModal
                modalId="create-course"
            />
            <CourseModal
                modalId="edit-course"
                course={currentCourse!}
            />
        </AppLayout>
    );
}