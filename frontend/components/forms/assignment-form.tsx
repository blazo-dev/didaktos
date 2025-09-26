'use client';

import { AssignmentFormData, assignmentSchema } from "@/lib/schemas/assignment";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useToastStore } from "@/stores/toast-store";
import { Assignment } from "@/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCreateAssignment } from "@/hooks/assignments/use-create-assignment";
import { useUpdateAssignment } from "@/hooks/assignments/use-update-assignment";


interface AssignmentFormProps {
    assignment?: Assignment;
    onSuccess?: (assignment: Assignment) => void;
    onCancel?: () => void;
}

export function AssignmentForm({ assignment, onSuccess, onCancel }: AssignmentFormProps) {
    const { user } = useAuthStore();
    const { currentModule } = useCoursesStore();
    const { addToast } = useToastStore();
    const createAssignmentMutation = useCreateAssignment();
    const updateAssignmentMutation = useUpdateAssignment();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AssignmentFormData>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            title: assignment?.title || '',
            description: assignment?.description || '',
            dueDate: assignment?.dueDate ? assignment.dueDate.split('T')[0] : '',
        },
    });

    // Handle success with useEffect
    useEffect(() => {
        if (createAssignmentMutation.isSuccess || updateAssignmentMutation.isSuccess) {
            reset();
            onSuccess?.(assignment as Assignment);
        }
    }, [createAssignmentMutation.isSuccess, updateAssignmentMutation.isSuccess, assignment, onSuccess, reset]);

    const onSubmit = (data: AssignmentFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create an assignment',
                type: 'error',
            });
            return;
        }

        if (assignment) {
            // Update existing assignment
            updateAssignmentMutation.mutate({
                assignmentId: assignment.id,
                assignmentData: data,
            });
        } else {
            // Create new assignment
            const newAssignment = {
                ...data,
            };

            createAssignmentMutation.mutate({
                moduleId: currentModule!.id,
                assignmentData: newAssignment,
            });
        }
    };

    const isLoading = createAssignmentMutation.isPending || updateAssignmentMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            {/* Assignment Title */}
            <Input
                id="assignment-title"
                label="Assignment Title"
                placeholder="Enter assignment title"
                type="text"
                required
                register={register("title")}
                error={errors.title?.message}
            />

            {/* Assignment Due Date */}
            <Input
                id="assignment-due-date"
                label="Assignment Due Date"
                placeholder="Enter assignment due date"
                type="date"
                required
                register={register("dueDate")}
                error={errors.dueDate?.message}
            />

            {/* Assignment Description */}
            <Textarea
                id="assignment-description"
                label="Assignment Description"
                placeholder="Enter assignment description"
                rows={10}
                required
                register={register("description")}
                error={errors.description?.message}
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
                            <span>{assignment ? 'Updating...' : 'Creating...'}</span>
                        </div>
                    ) : (
                        assignment ? 'Update Assignment' : 'Create Assignment'
                    )}
                </Button>
            </div>
        </form>
    );
}