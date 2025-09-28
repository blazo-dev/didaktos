'use client';

import { useModuleFromUrl } from '@/hooks/common/use-url-entity';
import { useCreateLesson, useUpdateLesson } from "@/hooks/lessons/use-lesson-crud";
import { LessonFormData, lessonSchema } from "@/lib/schemas/lesson";
// Removed: import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/ui-store";
import { Lesson } from "@/types/course";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { BaseForm } from "./common/base-form";

interface LessonFormProps {
    lesson?: Lesson;
    moduleId?: string; // Optional prop for when URL doesn't contain moduleId
    onSuccess?: (lesson: Lesson) => void;
    onCancel?: () => void;
}

function LessonFormFields() {
    const { register, formState: { errors } } = useFormContext<LessonFormData>();

    return (
        <>
            {/* Lesson Title */}
            <Input
                id="lesson-title"
                label="Lesson Title"
                placeholder="Enter lesson title"
                type="text"
                required
                register={register("title")}
                error={errors.title?.message}
            />

            {/* Lesson Content */}
            <Textarea
                id="lesson-content"
                label="Lesson Content"
                placeholder="Enter lesson content"
                rows={10}
                required
                register={register("content")}
                error={errors.content?.message}
                className="resize-y"
            />
        </>
    );
}

export function LessonForm({ lesson, moduleId, onSuccess, onCancel }: LessonFormProps) {
    const { user } = useAuthStore();
    // Use URL-based entity resolution or props
    const { currentModule, moduleId: urlModuleId } = useModuleFromUrl();
    const { addToast } = useToastStore();
    const createLessonMutation = useCreateLesson();
    const updateLessonMutation = useUpdateLesson();

    // Use moduleId from props or URL
    const effectiveModuleId = moduleId || urlModuleId || currentModule?.id;

    // Handle success with useEffect
    useEffect(() => {
        if (createLessonMutation.isSuccess || updateLessonMutation.isSuccess) {
            const resultLesson = createLessonMutation.data || updateLessonMutation.data || lesson;
            onSuccess?.(resultLesson as Lesson);
        }
    }, [createLessonMutation.isSuccess, updateLessonMutation.isSuccess, createLessonMutation.data, updateLessonMutation.data, lesson, onSuccess]);

    const handleSubmit = async (data: LessonFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create a lesson',
                type: 'error',
            });
            return;
        }

        if (lesson) {
            // Update existing lesson
            await updateLessonMutation.mutateAsync({
                id: lesson.id,
                lessonData: data,
            });
        } else {
            // Create new lesson
            const newLesson = {
                ...data,
            };

            await createLessonMutation.mutateAsync({
                moduleId: effectiveModuleId!,
                lessonData: newLesson,
            });
        }
    };

    return (
        <BaseForm<LessonFormData>
            initialValues={{
                title: lesson?.title || '',
                content: lesson?.content || '',
            }}
            validationSchema={lessonSchema}
            onSubmit={handleSubmit}
            onCancel={onCancel || (() => { })}
            isEdit={!!lesson}
            submitText={{ create: 'Create Lesson', update: 'Update Lesson' }}
            loadingText={{ create: 'Creating...', update: 'Updating...' }}
        >
            <LessonFormFields />
        </BaseForm>
    );
}