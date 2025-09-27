'use client';

import { useCreateSubmission } from "@/hooks/submissions/use-submission-crud";
import { SubmissionFormData, submissionSchema } from "@/lib/schemas/submission";
import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/ui-store";
import { Assignment, Submission } from "@/types/course";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { BaseForm } from "./common/base-form";

interface SubmissionFormProps {
    assignment?: Assignment;
    courseId?: string;
    onSuccess: (submission: any) => void;
    onCancel?: () => void;
}

function SubmissionFormFields() {
    const { register, formState: { errors } } = useFormContext<SubmissionFormData>();

    return (
        <>
            {/* Submission Content */}
            <Textarea
                id="submission-content"
                label="Your Submission"
                placeholder="Enter your assignment submission here..."
                rows={10}
                required
                register={register("content")}
                error={errors.content?.message}
                className="resize-y"
            />
        </>
    );
}

export function SubmissionForm({ assignment, courseId, onSuccess, onCancel }: SubmissionFormProps) {
    const { user } = useAuthStore();
    const { currentCourse, currentAssignment } = useAppStore();
    const createSubmissionMutation = useCreateSubmission();
    const { addToast } = useToastStore();

    const handleSubmit = async (data: SubmissionFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to submit an assignment',
                type: 'error',
            });
            return;
        }

        const submissionData: Submission = {
            content: data.content,
            assignmentId: assignment?.id || currentAssignment?.id || '',
            studentId: user.id,
            courseId: courseId || currentCourse?.id || '',
        };

        try {
            // Here you would call your submission API
            await createSubmissionMutation.mutateAsync({ submissionData });
            onSuccess(submissionData);
        } catch (error) {
            // Error handling is done in the mutation
        }
    };

    return (
        <BaseForm<SubmissionFormData>
            initialValues={{
                content: '',
            }}
            validationSchema={submissionSchema}
            onSubmit={handleSubmit}
            onCancel={onCancel || (() => { })}
            isEdit={false}
            submitText={{ create: 'Submit Assignment', update: 'Submit Assignment' }}
            loadingText={{ create: 'Submitting...', update: 'Submitting...' }}
        >
            <SubmissionFormFields />
        </BaseForm>
    );
}