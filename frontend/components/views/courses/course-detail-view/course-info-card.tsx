'use client';

import { Award, BookOpen, Calendar, User, Users } from 'lucide-react';
import { Course } from '../../../../types/course';
import { Card } from '../../../ui/card';

interface CourseInfoCardProps {
    course: Course;
    isOwner: boolean;
    isEnrolled: boolean;
    totalLessons: number;
    totalAssignments: number;
}

export function CourseInfoCard({
    course,
    isOwner,
    isEnrolled,
    totalLessons,
    totalAssignments
}: CourseInfoCardProps) {
    return (
        <Card className="p-6">
            <div className="space-y-4">
                {/* Course Status Badges */}
                <div className="flex items-center gap-2 mb-4">
                    {isOwner && (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Course Owner
                        </span>
                    )}
                    {isEnrolled && !isOwner && (
                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                            Enrolled Student
                        </span>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-lg text-muted-foreground">
                        {course.description}
                    </p>
                </div>

                <div className="flex space-x-4 flex-wrap text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrollments.length} enrolled
                    </div>
                    <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {totalLessons} lessons
                    </div>
                    <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {totalAssignments} assignments
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Updated {new Date(course.updatedAt).toLocaleDateString()}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                        <p className="font-medium">Instructor</p>
                        <p className="text-sm text-muted-foreground">
                            {course.instructor.name}
                            {isOwner && <span className="text-blue-600 ml-1">(You)</span>}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}