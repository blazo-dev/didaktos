'use client';

import { AppLayout } from "@/components/layout/app-layout";
import Loader from "@/components/layout/loader";
import { CourseModal } from "@/components/modals/course-modal";
import { useCourseFiltering } from "@/hooks/courses/use-course-filtering";
import { useCourses } from "@/hooks/courses/use-courses";
// Removed: import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useModalStore } from "@/stores/ui-store";
import { CoursesFilters } from "./courses-filters";
import { CoursesGrid } from "./courses-grid";
import { CoursesHeader } from "./courses-header";

export function CoursesLayout() {
    const { user } = useAuthStore();
    const { openModal } = useModalStore();
    // Removed: const { currentCourse } = useAppStore();
    const { data: courses = [], isLoading } = useCourses();

    // Use the new filtering hook
    const {
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        filteredCourses,
        stats
    } = useCourseFiltering(courses, user?.id);

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
                    ownedCoursesCount={stats.ownedCount}
                    enrolledCoursesCount={stats.enrolledCount}
                    onCreateCourse={handleCreateCourse}
                />

                <CoursesFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterType={filterType}
                    onFilterChange={setFilterType}
                    ownedCoursesCount={stats.ownedCount}
                    enrolledCoursesCount={stats.enrolledCount}
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
            />
        </AppLayout>
    );
}