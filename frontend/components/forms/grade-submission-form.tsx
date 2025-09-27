'use client';

import { useGradeSubmission } from "@/hooks/submissions/use-grade-submission";
import { SubmissionGradeRequestDto } from "@/lib/api/submission";
import { GradeSubmissionFormData, gradeSubmissionSchema } from "@/lib/schemas/submission";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useToastStore } from "@/stores/ui-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { FormActions } from "./common/form-actions";

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

    const onSubmit = async (data: GradeSubmissionFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to submit an assignment',
                type: 'error',
            });
            return;
        }

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
            // Error handling is done in the mutation
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
            <FormActions
                onCancel={onCancel || (() => { })}
                isPending={createGradeSubmissionMutation.isPending}
                isEdit={false}
                submitText={{ create: 'Grade Assignment', update: 'Grade Assignment' }}
                loadingText={{ create: 'Grading...', update: 'Grading...' }}
            />
        </form>
    );
}