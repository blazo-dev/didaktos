'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingOverlay } from '@/components/ui/global-loading-indicator';
import { useEnhancedFormMutation } from '@/hooks/forms/use-enhanced-form-mutation';
import { CourseFormData, courseSchema } from '@/lib/schemas/course';
import { coursesApi } from '@/lib/api/course';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/ui-store';
import { useCoursesStore } from '@/stores/courses-store';
import { Course } from '@/types/course';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { BaseForm } from './common/base-form';

interface EnhancedCourseFormProps {
    course?: Course;
    onSuccess?: (course: Course) => void;
    onCancel?: () => void;
}

function CourseFormFields() {
    const { register, formState: { errors }, watch } = useFormContext<CourseFormData>();
    
    // Watch for changes to provide real-time feedback
    const title = watch('title');
    const description = watch('description');

    return (
        <>
            {/* Course Title with real-time validation */}
            <Input
                id="course-title"
                label="Course Title"
                placeholder="Enter course title"
                type="text"
                required
                register={register("title")}
                error={errors.title?.message}
            />
            {title && title.length > 50 && (
                <p className="text-xs text-orange-600 mt-1">
                    Consider a shorter title for better readability ({title.length}/50 characters)
                </p>
            )}

            {/* Course Description with character count */}
            <div className="relative">
                <Textarea
                    id="course-description"
                    label="Course Description"
                    placeholder="Enter course description"
                    rows={4}
                    required
                    register={register("description")}
                    error={errors.description?.message}
                />
                {description && (
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {description.length}/500 characters
                    </p>
                )}
            </div>
        </>
    );
}

export function EnhancedCourseForm({ course, onSuccess, onCancel }: EnhancedCourseFormProps) {
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const { setCourses, setCurrentCourse } = useCoursesStore();

    // Enhanced form mutation with all advanced patterns
    const mutation = useEnhancedFormMutation<Course, CourseFormData & { id?: string }>({
        createFn: async (data) => {
            const newCourseData = {
                ...data,
                instructor: {
                    id: user!.id,
                    name: user!.name || '',
                    email: user!.email,
                },
                enrollments: [],
                modules: [],
            };
            return coursesApi.createCourse(newCourseData);
        },
        updateFn: async (data) => {
            return coursesApi.updateCourse(course!.id, data);
        },
        
        // Query invalidation
        queryKeys: [['courses']],
        
        // Optimistic updates configuration
        optimisticType: 'course',
        getOptimisticData: (variables) => ({
            ...course,
            ...variables,
            id: course?.id || `optimistic_${Date.now()}`,
            instructor: course?.instructor || {
                id: user!.id,
                name: user!.name || '',
                email: user!.email,
            },
            enrollments: course?.enrollments || [],
            modules: course?.modules || [],
        } as Course),
        getOriginalData: () => course!,
        
        // Enhanced loading and error handling
        loadingMessage: course ? 'Updating course...' : 'Creating course...',
        componentName: 'CourseForm',
        
        // Success/error callbacks with state updates
        onSuccess: (data, variables) => {
            // Update current course if editing
            if (course) {
                setCurrentCourse(data);
            }
            
            addToast({
                message: course ? 'Course updated successfully!' : 'Course created successfully!',
                type: 'success',
            });
            
            onSuccess?.(data);
        },
        
        onError: (error, variables) => {
            addToast({
                message: `Failed to ${course ? 'update' : 'create'} course: ${error.message}`,
                type: 'error',
            });
        },
    });

    const handleSubmit = async (data: CourseFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create a course',
                type: 'error',
            });
            return;
        }

        if (course) {
            mutation.handleSubmit.update({ ...data, id: course.id });
        } else {
            mutation.handleSubmit.create(data);
        }
    };

    const initialValues = useMemo(() => ({
        title: course?.title || '',
        description: course?.description || '',
    }), [course]);

    return (
        <ErrorBoundary
            componentName="CourseForm"
            level="component"
        >
            <LoadingOverlay
                isLoading={mutation.isLoading}
                message={course ? 'Updating course...' : 'Creating course...'}
            >
                <BaseForm<CourseFormData>
                    initialValues={initialValues}
                    validationSchema={courseSchema}
                    onSubmit={handleSubmit}
                    onCancel={onCancel || (() => { })}
                    isEdit={!!course}
                    submitText={{ 
                        create: 'Create Course', 
                        update: 'Update Course',
                    }}
                    loadingText={{ 
                        create: 'Creating...', 
                        update: 'Updating...',
                    }}
                >
                    <CourseFormFields />
                    
                    {/* Show optimistic update status */}
                    {mutation.isLoading && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                <p className="text-sm text-blue-700">
                                    {course ? 'Updating course with optimistic UI...' : 'Creating course with immediate feedback...'}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Show error recovery options */}
                    {mutation.isError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700 mb-2">
                                Failed to {course ? 'update' : 'create'} course. Your changes have been reverted.
                            </p>
                            <button
                                onClick={() => mutation.resetMutations()}
                                className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </BaseForm>
            </LoadingOverlay>
        </ErrorBoundary>
    );
}

// Export both versions for compatibility
export { EnhancedCourseForm as CourseForm };