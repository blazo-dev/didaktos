'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse } from '@/hooks/courses/use-create-course';
import { useUpdateCourse } from '@/hooks/courses/use-update-course';
import { CourseFormData, courseSchema } from '@/lib/schemas/course';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/toast-store';
import { Course } from '@/types/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CourseFormProps {
    course?: Course;
    onSuccess?: (course: Course) => void;
    onCancel?: () => void;
}

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: course?.title || '',
            description: course?.description || '',
        },
    });

    // Handle success with useEffect
    useEffect(() => {
        if (createCourseMutation.isSuccess || updateCourseMutation.isSuccess) {
            reset();
            onSuccess?.(course as Course);
        }
    }, [createCourseMutation.isSuccess, updateCourseMutation.isSuccess, course, onSuccess, reset]);

    const onSubmit = (data: CourseFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create a course',
                type: 'error',
            });
            return;
        }

        if (course) {
            // Update existing course
            updateCourseMutation.mutate({
                id: course.id,
                data: data,
            });
        } else {
            // Create new course
            const newCourseData = {
                ...data,
                instructor: {
                    id: user.id,
                    name: user.name || '',
                    email: user.email,
                },
                enrollments: [],
                modules: [],
            };

            createCourseMutation.mutate(newCourseData);
        }
    };

    const isLoading = createCourseMutation.isPending || updateCourseMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            {/* Course Title */}
            <Input
                id="course-title"
                label="Course Title"
                placeholder="Enter course title"
                type="text"
                required
                register={register("title")}
                error={errors.title?.message}
            />

            {/* Course Description */}
            <Textarea
                id="course-description"
                label="Course Description"
                placeholder="Enter course description"
                rows={4}
                required
                register={register("description")}
                error={errors.description?.message}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>{course ? 'Updating...' : 'Creating...'}</span>
                        </div>
                    ) : (
                        course ? 'Update Course' : 'Create Course'
                    )}
                </Button>
            </div>
        </form>
    );
}