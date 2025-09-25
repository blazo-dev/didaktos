'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Plus } from "lucide-react";
import { FilterType } from "./courses-filters";

interface CoursesEmptyStateProps {
    searchTerm: string;
    filterType: FilterType;
    onCreateCourse: () => void;
    onEnrollCourse: () => void;
}

export function CoursesEmptyState({
    searchTerm,
    filterType,
    onCreateCourse,
    onEnrollCourse
}: CoursesEmptyStateProps) {
    const getTitle = () => {
        if (searchTerm) return 'No courses found';

        switch (filterType) {
            case 'owned':
                return 'No courses created yet';
            case 'enrolled':
                return 'No enrolled courses';
            default:
                return 'No courses found';
        }
    };

    const getDescription = () => {
        if (searchTerm) return 'Try adjusting your search terms';

        switch (filterType) {
            case 'owned':
                return 'Create your first course to get started as an instructor';
            case 'enrolled':
                return 'Enroll in courses to start learning';
            default:
                return 'Create a course or enroll in existing ones to get started';
        }
    };

    const showActions = !searchTerm;
    const showCreateButton = filterType === 'all' || filterType === 'owned';
    const showEnrollButton = filterType === 'all' || filterType === 'enrolled';

    return (
        <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>
            <p className="text-muted-foreground mb-6">{getDescription()}</p>

            {showActions && (
                <div className="flex justify-center gap-3">
                    {showCreateButton && (
                        <Button onClick={onCreateCourse}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Course
                        </Button>
                    )}
                    {showEnrollButton && (
                        <Button variant="outline" onClick={onEnrollCourse}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Enroll in Course
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
}