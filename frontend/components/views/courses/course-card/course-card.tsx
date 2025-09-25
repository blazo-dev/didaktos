'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/use-auth';
import { useDeleteCourse } from '@/hooks/courses/use-delete-course';
import { useEnrollments } from '@/hooks/enrollments/use-enrollments';
import { Course } from '@/types/course';
import {
    BookOpen,
    Edit,
    Eye,
    MoreVertical,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { data: enrollments } = useEnrollments();
    const [showMenu, setShowMenu] = useState(false);
    const deleteCourse = useDeleteCourse();

    const isOwner = user?.id === course.instructor.id;
    const isEnrolled = enrollments?.some(
        (enrollment) =>
            enrollment.courseId === course.id && enrollment.studentId === user?.id,
    );
    const studentCount =
        enrollments?.filter((enrollment) => enrollment.courseId === course.id)
            .length || 0;

    const handleViewCourse = () => {
        router.push(`/courses/${course.id}`);
    };

    const handleEditCourse = () => {
        router.push(`/courses/${course.id}/edit`);
    };

    const handleDeleteCourse = async () => {
        if (
            confirm(
                'Are you sure you want to delete this course? This action cannot be undone.',
            )
        ) {
            await deleteCourse.mutateAsync(course.id);
        }
        setShowMenu(false);
    };

    return (
        <Card className="relative group">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {isOwner && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            Owner
                        </span>
                    )}
                    {isEnrolled && !isOwner && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Enrolled
                        </span>
                    )}
                </div>
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 border rounded-lg shadow-lg bg-white z-10 py-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={handleEditCourse}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-red-600"
                                onClick={handleDeleteCourse}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="truncate">
                        {course.description}
                    </CardDescription>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {studentCount} students
                    </div>
                    <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        0 modules
                    </div>
                </div>

                {!isOwner && (
                    <div className="text-sm text-muted-foreground">
                        Instructor: {course.instructor.name}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-end mt-auto border-t">
                <Button onClick={handleViewCourse} size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {isOwner ? 'Manage' : 'View Course'}
                </Button>
            </CardFooter>
        </Card>
    );
}
