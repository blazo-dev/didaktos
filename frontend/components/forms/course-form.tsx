'use client';

import { Button } from '@/components/ui/button';
import { useCreateCourse } from '@/hooks/courses/use-create-course';
import { useUpdateCourse } from '@/hooks/courses/use-update-course';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/toast-store';
import { Course } from '@/types/course';
import { useEffect, useState } from 'react';

interface CourseFormProps {
    course?: Course;
    onSuccess?: (course: Course) => void;
    onCancel?: () => void;
}

interface CourseFormData {
    title: string;
    description: string;
}

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    // Handle success with useEffect
    useEffect(() => {
        if (createCourseMutation.isSuccess || updateCourseMutation.isSuccess) {
            setFormData({ title: '', description: '' });
            onSuccess?.(course as Course);
        }
    }, [createCourseMutation.isSuccess, updateCourseMutation.isSuccess, course, onSuccess]);

    const [formData, setFormData] = useState<CourseFormData>({
        title: course?.title || '',
        description: course?.description || '',
    });

    const [errors, setErrors] = useState<Partial<CourseFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<CourseFormData> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
                data: formData,
            });
        } else {
            // Create new course
            const newCourseData = {
                ...formData,
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

        // Reset form
        setFormData({ title: '', description: '' });
    };

    const handleInputChange = (field: keyof CourseFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const isLoading = createCourseMutation.isPending || updateCourseMutation.isPending;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
            {/* Course Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Course Title *
                </label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('title', e.target.value)
                    }
                    placeholder="Enter course title"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.title ? 'border-destructive' : 'border-border'
                        }`}
                    disabled={isLoading}
                />
                {errors.title && (
                    <p className="text-destructive text-sm mt-1">{errors.title}</p>
                )}
            </div>

            {/* Course Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Course Description *
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange('description', e.target.value)
                    }
                    placeholder="Enter course description"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${errors.description ? 'border-destructive' : 'border-border'
                        }`}
                    disabled={isLoading}
                />
                {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description}</p>
                )}
            </div>

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
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[100px]"
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