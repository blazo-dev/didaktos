'use client';

import { AppLayout } from "@/components/layout/app-layout";
import Loader from "@/components/layout/loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCourses } from "@/hooks/courses/use-courses";
import { useAuthStore } from "@/stores/auth-store";
import { BookOpen, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";
import { CourseCard } from "./course-card";

export function CoursesLayout() {
    const { user } = useAuthStore();
    const { data: courses, isLoading } = useCourses();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'owned' | 'enrolled'>('all');

    // Filter courses based on user relationship and search term
    const filteredCourses = courses?.filter(course => {
        // Text search filter
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Relationship filter
        const isOwner = course.instructor.id === user?.id;
        const isEnrolled = course.students.some(student => student.id === user?.id);

        switch (filterType) {
            case 'owned':
                return isOwner;
            case 'enrolled':
                return isEnrolled && !isOwner; // Only show courses where user is enrolled but not owner
            case 'all':
            default:
                return isOwner || isEnrolled;
        }
    }) || [];

    // Count different types of courses
    const ownedCoursesCount = courses?.filter(course => course.instructor.id === user?.id).length || 0;
    const enrolledCoursesCount = courses?.filter(course =>
        course.students.some(student => student.id === user?.id) && course.instructor.id !== user?.id
    ).length || 0;

    if (isLoading) {
        return <Loader text="Loading courses..." />;
    }

    return (
        <AppLayout showSidebar showHeader>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Courses</h1>
                        <p className="text-muted-foreground">
                            Manage and continue your learning journey
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{ownedCoursesCount} courses created</span>
                            <span>•</span>
                            <span>{enrolledCoursesCount} courses enrolled</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowEnrollModal(true)}
                            variant="outline"
                        >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Enroll in Course
                        </Button>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Course
                        </Button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center justify-between gap-4">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filterType === 'all'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                All Courses
                            </button>
                            <button
                                onClick={() => setFilterType('owned')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filterType === 'owned'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                My Courses ({ownedCoursesCount})
                            </button>
                            <button
                                onClick={() => setFilterType('enrolled')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filterType === 'enrolled'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Enrolled ({enrolledCoursesCount})
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Courses Grid */}
                {filteredCourses.length === 0 ? (
                    <Card className="p-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchTerm
                                ? 'No courses found'
                                : filterType === 'owned'
                                    ? 'No courses created yet'
                                    : filterType === 'enrolled'
                                        ? 'No enrolled courses'
                                        : 'No courses found'
                            }
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : filterType === 'owned'
                                    ? 'Create your first course to get started as an instructor'
                                    : filterType === 'enrolled'
                                        ? 'Enroll in courses to start learning'
                                        : 'Create a course or enroll in existing ones to get started'
                            }
                        </p>
                        {!searchTerm && (
                            <div className="flex justify-center gap-3">
                                {(filterType === 'all' || filterType === 'owned') && (
                                    <Button onClick={() => setShowCreateModal(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Course
                                    </Button>
                                )}
                                {(filterType === 'all' || filterType === 'enrolled') && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowEnrollModal(true)}
                                    >
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Enroll in Course
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                            />
                        ))}
                    </div>
                )}

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