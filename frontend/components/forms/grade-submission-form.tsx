'use client';

import { useGradeSubmission } from "@/hooks/submissions/use-submission-crud";
import { SubmissionGradeRequestDto } from "@/lib/api/submission";
import { GradeSubmissionFormData, gradeSubmissionSchema } from "@/lib/schemas/submission";
// Removed: import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/ui-store";
import { Submission } from "@/types/course";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { BaseForm } from "./common/base-form";

interface SubmissionFormProps {
    submission?: Submission;
    courseId?: string;
    onSuccess: (submission: any) => void;
    onCancel?: () => void;
}

function GradeSubmissionFormFields() {
    const { register, formState: { errors } } = useFormContext<GradeSubmissionFormData>();

    return (
        <>
            {/* Grade Input */}
            <Input
                type="number"
                id="grade-submission-content"
                label="Grade"
                required
                placeholder="Enter grade (0-100)"
                register={register("grade", { valueAsNumber: true })}
                error={errors.grade?.message}
            />
        </>
    );
}

export function GradeSubmissionForm({ submission, courseId, onSuccess, onCancel }: SubmissionFormProps) {
    const { user } = useAuthStore();
    // Use props instead of global state
    const createGradeSubmissionMutation = useGradeSubmission();
    const { addToast } = useToastStore();

    const handleSubmit = async (data: GradeSubmissionFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to grade a submission',
                type: 'error',
            });
            return;
        }

        const gradeData: SubmissionGradeRequestDto = {
            id: submission?.id || '',
            grade: Number(data.grade),
            courseId: courseId || submission?.courseId || '',
        };

        try {
            // Here you would call your submission API
            await createGradeSubmissionMutation.mutateAsync(gradeData);
            onSuccess(gradeData);
        } catch (error) {
            // Error handling is done in the mutation
        }
    };

    return (
        <BaseForm<GradeSubmissionFormData>
            initialValues={{
                grade: 0,
            }}
            validationSchema={gradeSubmissionSchema}
            onSubmit={handleSubmit}
            onCancel={onCancel || (() => { })}
            isEdit={false}
            submitText={{ create: 'Grade Assignment', update: 'Grade Assignment' }}
            loadingText={{ create: 'Grading...', update: 'Grading...' }}
        >
            <GradeSubmissionFormFields />
        </BaseForm>
    );
}