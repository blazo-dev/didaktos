'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse } from '@/hooks/courses/use-create-course';
import { useUpdateCourse } from '@/hooks/courses/use-update-course';
import { CourseFormData, courseSchema } from '@/lib/schemas/course';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/ui-store';
import { Course } from '@/types/course';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { BaseForm } from './common/base-form';

interface CourseFormProps {
    course?: Course;
    onSuccess?: (course: Course) => void;
    onCancel?: () => void;
}

function CourseFormFields() {
    const { register, formState: { errors } } = useFormContext<CourseFormData>();

    return (
        <>
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
        </>
    );
}

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    // Handle success with useEffect
    useEffect(() => {
        if (createCourseMutation.isSuccess || updateCourseMutation.isSuccess) {
            const resultCourse = createCourseMutation.data || updateCourseMutation.data || course;
            onSuccess?.(resultCourse as Course);
        }
    }, [createCourseMutation.isSuccess, updateCourseMutation.isSuccess, createCourseMutation.data, updateCourseMutation.data, course, onSuccess]);

    const handleSubmit = async (data: CourseFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create a course',
                type: 'error',
            });
            return;
        }

        if (course) {
            // Update existing course
            await updateCourseMutation.mutateAsync({
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

            await createCourseMutation.mutateAsync(newCourseData);
        }
    };

    return (
        <BaseForm<CourseFormData>
            initialValues={{
                title: course?.title || '',
                description: course?.description || '',
            }}
            validationSchema={courseSchema}
            onSubmit={handleSubmit}
            onCancel={onCancel || (() => { })}
            isEdit={!!course}
            submitText={{ create: 'Create Course', update: 'Update Course' }}
            loadingText={{ create: 'Creating...', update: 'Updating...' }}
        >
            <CourseFormFields />
        </BaseForm>
    );
}