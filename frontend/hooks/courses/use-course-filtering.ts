import { Course } from "@/types/course";
import { useMemo, useState } from "react";

export type FilterType = "all" | "owned" | "enrolled";

/**
 * Optimized course filtering hook with memoization
 * Manages search, filtering, and course statistics efficiently
 */
export function useCourseFiltering(courses: Course[], userId?: string) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");

    // Categorize courses by relationship - memoized
    const coursesByRelation = useMemo(() => {
        const owned = courses.filter(
            (course) => course.instructor?.id === userId
        );
        const enrolled = courses.filter(
            (course) =>
                course.enrollments?.includes(userId || "") &&
                course.instructor?.id !== userId
        );

        return {
            owned,
            enrolled,
            all: courses,
        };
    }, [courses, userId]);

    // Apply filters with memoization
    const filteredCourses = useMemo(() => {
        let baseCourses = coursesByRelation.all;

        // Apply relationship filter first
        switch (filterType) {
            case "owned":
                baseCourses = coursesByRelation.owned;
                break;
            case "enrolled":
                baseCourses = coursesByRelation.enrolled;
                break;
            default:
                baseCourses = coursesByRelation.all;
        }

        // Apply search filter if present
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            return baseCourses.filter((course) => {
                const titleMatch = course.title
                    .toLowerCase()
                    .includes(searchLower);
                const descriptionMatch = course.description
                    .toLowerCase()
                    .includes(searchLower);
                const instructorMatch =
                    course.instructor?.name
                        ?.toLowerCase()
                        .includes(searchLower) || false;

                return titleMatch || descriptionMatch || instructorMatch;
            });
        }

        return baseCourses;
    }, [coursesByRelation, filterType, searchTerm]);

    // Course statistics - memoized
    const stats = useMemo(() => {
        const totalModules = coursesByRelation.all.reduce(
            (acc, course) => acc + (course.modules?.length || 0),
            0
        );
        const totalLessons = coursesByRelation.all.reduce(
            (acc, course) =>
                acc +
                (course.modules || []).reduce(
                    (moduleAcc, module) => moduleAcc + module.lessons.length,
                    0
                ),
            0
        );
        const totalAssignments = coursesByRelation.all.reduce(
            (acc, course) =>
                acc +
                (course.modules || []).reduce(
                    (moduleAcc, module) =>
                        moduleAcc + (module.assignments?.length || 0),
                    0
                ),
            0
        );

        return {
            ownedCount: coursesByRelation.owned.length,
            enrolledCount: coursesByRelation.enrolled.length,
            totalCount: coursesByRelation.all.length,
            filteredCount: filteredCourses.length,
            totalModules,
            totalLessons,
            totalAssignments,
            averageModulesPerCourse:
                coursesByRelation.all.length > 0
                    ? Math.round(totalModules / coursesByRelation.all.length)
                    : 0,
        };
    }, [coursesByRelation, filteredCourses]);

    // Filter summary for UI display
    const filterSummary = useMemo(() => {
        const hasSearch = searchTerm.trim().length > 0;
        const isFiltered = filterType !== "all" || hasSearch;

        let description = "";
        if (!isFiltered) {
            description = `Showing all ${stats.totalCount} courses`;
        } else {
            let filterDesc = "";
            switch (filterType) {
                case "owned":
                    filterDesc = "courses you own";
                    break;
                case "enrolled":
                    filterDesc = "courses you're enrolled in";
                    break;
                default:
                    filterDesc = "courses";
            }

            if (hasSearch) {
                description = `Found ${stats.filteredCount} ${filterDesc} matching "${searchTerm}"`;
            } else {
                description = `Showing ${stats.filteredCount} ${filterDesc}`;
            }
        }

        return {
            description,
            isFiltered,
            hasSearch,
            hasResults: stats.filteredCount > 0,
            showingAll: !isFiltered && stats.filteredCount === stats.totalCount,
        };
    }, [filterType, searchTerm, stats]);

    // Helper methods
    const clearSearch = () => setSearchTerm("");
    const clearFilters = () => {
        setSearchTerm("");
        setFilterType("all");
    };

    const applyQuickFilter = (type: FilterType, search?: string) => {
        setFilterType(type);
        if (search !== undefined) {
            setSearchTerm(search);
        }
    };

    return {
        // Filter state
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,

        // Results
        filteredCourses,
        coursesByRelation,

        // Statistics
        stats,
        filterSummary,

        // Helper methods
        clearSearch,
        clearFilters,
        applyQuickFilter,

        // Computed flags
        isEmpty: stats.totalCount === 0,
        hasFilters: filterType !== "all" || searchTerm.trim().length > 0,
        isSearching: searchTerm.trim().length > 0,
    };
}
