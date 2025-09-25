'use client';

import { Course } from "../../../../types/course";
import { CourseCard } from "../course-card/course-card";
import { CoursesEmptyState } from "./courses-empty-state";
import { FilterType } from "./courses-filters";

interface CoursesGridProps {
    courses: Course[];
    searchTerm: string;
    filterType: FilterType;
    onCreateCourse: () => void;
    onEnrollCourse: () => void;
}

export function CoursesGrid({
    courses,
    searchTerm,
    filterType,
    onCreateCourse,
    onEnrollCourse
}: CoursesGridProps) {
    if (courses.length === 0) {
        return (
            <CoursesEmptyState
                searchTerm={searchTerm}
                filterType={filterType}
                onCreateCourse={onCreateCourse}
                onEnrollCourse={onEnrollCourse}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    course={course}
                />
            ))}
        </div>
    );
}