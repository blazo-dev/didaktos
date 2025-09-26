'use client';

import { useGradeSubmission } from "@/hooks/submissions/use-grade-submission";
import { SubmissionGradeRequestDto } from "@/lib/api/submission";
import { GradeSubmissionFormData, gradeSubmissionSchema } from "@/lib/schemas/submission";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useToastStore } from "@/stores/toast-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";




interface SubmissionFormProps {
    onSuccess: (submission: any) => void;
    onCancel?: () => void;
}

export function GradeSubmissionForm({ onSuccess, onCancel }: SubmissionFormProps) {
    const { user } = useAuthStore();
    const { currentCourse, currentSubmission } = useCoursesStore();
    const createGradeSubmissionMutation = useGradeSubmission();
    const { addToast } = useToastStore();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm<GradeSubmissionFormData>({
        resolver: zodResolver(gradeSubmissionSchema),
        defaultValues: {
            grade: 0,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: GradeSubmissionFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to submit an assignment',
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);

        const gradeData: SubmissionGradeRequestDto = {
            id: currentSubmission?.id || '',
            grade: Number(data.grade),
            courseId: currentCourse?.id || '',
        };

        try {
            // Here you would call your submission API
            await createGradeSubmissionMutation.mutateAsync(gradeData);


            reset();
            onSuccess(gradeData);
        } catch (error) {

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            {/* Submission Content */}
            <Input
                type="number"
                id="grade-submission-content"
                label="Your Submission"
                required
                placeholder="Enter your submission grading here..."
                register={register("grade", { valueAsNumber: true })}
                error={errors.grade?.message}
                className="resize-y"
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Grading...</span>
                        </div>
                    ) : (
                        'Grade Assignment'
                    )}
                </Button>
            </div>
        </form>
    );
}