'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
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
    Users
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

    // Check if current user is the creator/owner of this course
    const isOwner = user?.id === course.instructor.id;

    // Check if current user is enrolled as a student
    const isEnrolled = enrollments?.some(enrollment => enrollment.courseId === course.id && enrollment.studentId === user?.id);

    const studentCount = enrollments?.filter(enrollment => enrollment.courseId === course.id).length || 0;

    const handleViewCourse = () => {
        router.push(`/courses/${course.id}`);
    };

    const handleEditCourse = () => {
        router.push(`/courses/${course.id}/edit`);
    };

    const handleDeleteCourse = async () => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            await deleteCourse.mutateAsync(course.id);
        }
        setShowMenu(false);
    };

    // Calculate progress for enrolled students (mock for now)
    const completionPercentage = isEnrolled && !isOwner ? Math.floor(Math.random() * 100) : 0;

    return (
        <Card className="p-0 gap-0 relative group">
            <CardHeader className='p-4'>
                <div className="flex items-center justify-between gap-4 w-full">
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

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>

                    {showMenu && (
                        <div className="border rounded-lg shadow-lg py-1 z-10">
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={handleEditCourse}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={handleDeleteCourse}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>

            {/* Course Content */}
            <div className="space-y-4">
                <div className="px-4">
                    <div >
                        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                        <p className="text-muted-foreground text-sm truncate">
                            {course.description}
                        </p>
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
                    {/* Show instructor info if user is not the owner */}
                    <div className="text-sm text-muted-foreground">
                        <span>Instructor: {course.instructor.name}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                    {/* <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(course.updatedAt).toLocaleDateString()}
                        </div> */}
                    <Button onClick={handleViewCourse} size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {isOwner ? 'Manage' : 'View Course'}
                    </Button>
                </div>
            </div>
        </Card>
    );
}