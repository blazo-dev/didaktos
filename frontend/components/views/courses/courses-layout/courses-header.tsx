'use client';

import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface CoursesHeaderProps {
    ownedCoursesCount: number;
    enrolledCoursesCount: number;
    onCreateCourse: () => void;
    onEnrollCourse: () => void;
}

export function CoursesHeader({
    ownedCoursesCount,
    enrolledCoursesCount,
    onCreateCourse,
    onEnrollCourse
}: CoursesHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Courses</h1>
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
                    onClick={onEnrollCourse}
                    variant="outline"
                >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Enroll in Course
                </Button>
                <Button
                    onClick={onCreateCourse}
                    className="bg-primary hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                </Button>
            </div>
        </div>
    );
}