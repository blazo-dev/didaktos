'use client';

import { useCreateLesson } from "@/hooks/lessons/use-create-lesson";
import { useUpdateLesson } from "@/hooks/lessons/use-update-lesson";
import { LessonFormData, lessonSchema } from "@/lib/schemas/lesson";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { Lesson } from "@/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCoursesStore } from "@/stores/courses-store";


interface LessonFormProps {
    lesson?: Lesson;
    onSuccess?: (lesson: Lesson) => void;
    onCancel?: () => void;
}

export function LessonForm({ lesson, onSuccess, onCancel }: LessonFormProps) {
    const { user } = useAuthStore();
    const { currentModule, setCurrentLesson } = useCoursesStore();
    const { addToast } = useToastStore();
    const createLessonMutation = useCreateLesson();
    const updateLessonMutation = useUpdateLesson();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm<LessonFormData>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: lesson?.title || '',
            content: lesson?.content || '',
        },
    });

    // Handle success with useEffect
    useEffect(() => {
        if (createLessonMutation.isSuccess || updateLessonMutation.isSuccess) {
            reset();
            onSuccess?.(lesson as Lesson);
        }
    }, [createLessonMutation.isSuccess, updateLessonMutation.isSuccess, lesson, onSuccess, reset]);

    const onSubmit = (data: LessonFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create a lesson',
                type: 'error',
            });
            return;
        }

        if (lesson) {
            // Update existing lesson
            updateLessonMutation.mutate({
                id: lesson.id,
                lessonData: data,
            });
        } else {
            // Create new lesson
            const newLesson = {
                ...data,
            };

            createLessonMutation.mutate({
                moduleId: currentModule!.id,
                lessonData: newLesson,
            });
        }
    };

    const isLoading = createLessonMutation.isPending || updateLessonMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
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
                            <span>{lesson ? 'Updating...' : 'Creating...'}</span>
                        </div>
                    ) : (
                        lesson ? 'Update Lesson' : 'Create Lesson'
                    )}
                </Button>
            </div>
        </form>
    );
}