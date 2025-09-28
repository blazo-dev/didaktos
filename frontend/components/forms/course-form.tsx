'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse, useUpdateCourse } from '@/hooks/courses/use-course-crud';
import { CourseFormData, courseSchema } from '@/lib/schemas/course';
import { Course } from '@/types/course';
import { useFormContext } from 'react-hook-form';
import { BaseForm } from './common/base-form';

interface CourseFormProps {
    course?: Course;
    onSuccess: (course: Course) => void;
    onCancel: () => void;
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
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    const handleSubmit = async (data: CourseFormData) => {
        if (course) {
            // Update existing course
            await updateCourseMutation.mutateAsync({
                id: course.id,
                input: {
                    ...data
                }
            }, {
                onSuccess: onSuccess
            });
        } else {
            // Create new course
            const newCourseData = {
                ...data,
            };

            await createCourseMutation.mutateAsync({ ...newCourseData }, { onSuccess: onSuccess });
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
            onCancel={onCancel}
            isEdit={!!course}
            submitText={{ create: 'Create Course', update: 'Update Course' }}
            loadingText={{ create: 'Creating...', update: 'Updating...' }}
        >
            <CourseFormFields />
        </BaseForm>
    );
}