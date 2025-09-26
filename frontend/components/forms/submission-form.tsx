'use client';

import { useCreateSubmission } from "@/hooks/submissions/use-create-submission";
import { SubmissionFormData, submissionSchema } from "@/lib/schemas/submission";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useToastStore } from "@/stores/toast-store";
import { Assignment, Submission } from "@/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";




interface SubmissionFormProps {
    assignment?: Assignment;
    courseId?: string;
    onSuccess: (submission: any) => void;
    onCancel?: () => void;
}

export function SubmissionForm({ assignment, courseId, onSuccess, onCancel }: SubmissionFormProps) {
    const { user } = useAuthStore();
    const { currentCourse, currentAssignment } = useCoursesStore();
    const createSubmissionMutation = useCreateSubmission();
    const { addToast } = useToastStore();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmissionFormData>({
        resolver: zodResolver(submissionSchema),
        defaultValues: {
            content: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: SubmissionFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to submit an assignment',
                type: 'error',
            });
            return;
        }

        setIsSubmitting(true);

        const submissionData: Submission = {
            content: data.content,
            assignmentId: assignment?.id || currentAssignment?.id || '',
            studentId: user.id,
            courseId: courseId || currentCourse?.id || '',
        };

        try {
            // Here you would call your submission API
            await createSubmissionMutation.mutateAsync({ submissionData });


            reset();
            onSuccess(submissionData);
        } catch (error) {

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
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
                            <span>Submitting...</span>
                        </div>
                    ) : (
                        'Submit Assignment'
                    )}
                </Button>
            </div>
        </form>
    );
}