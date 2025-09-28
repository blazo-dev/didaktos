'use client';

import { useCreateAssignment, useUpdateAssignment } from "@/hooks/assignments/use-assignment-crud";
import { useModuleFromUrl } from '@/hooks/common/use-url-entity';
import { AssignmentFormData, assignmentSchema } from "@/lib/schemas/assignment";
// Removed: import { useAppStore } from "@/stores/app-store";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/ui-store";
import { Assignment } from "@/types/course";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { BaseForm } from "./common/base-form";

interface AssignmentFormProps {
    assignment?: Assignment;
    moduleId?: string; // Optional prop for when URL doesn't contain moduleId
    onSuccess?: (assignment: Assignment) => void;
    onCancel?: () => void;
}

function AssignmentFormFields() {
    const { register, formState: { errors } } = useFormContext<AssignmentFormData>();

    return (
        <>
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
        </>
    );
}

export function AssignmentForm({ assignment, moduleId, onSuccess, onCancel }: AssignmentFormProps) {
    const { user } = useAuthStore();
    // Use URL-based entity resolution or props
    const { currentModule, moduleId: urlModuleId } = useModuleFromUrl();
    const { addToast } = useToastStore();
    const createAssignmentMutation = useCreateAssignment();
    const updateAssignmentMutation = useUpdateAssignment();

    // Use moduleId from props or URL
    const effectiveModuleId = moduleId || urlModuleId || currentModule?.id;

    // Handle success with useEffect
    useEffect(() => {
        if (createAssignmentMutation.isSuccess || updateAssignmentMutation.isSuccess) {
            const resultAssignment = createAssignmentMutation.data || updateAssignmentMutation.data || assignment;
            onSuccess?.(resultAssignment as Assignment);
        }
    }, [createAssignmentMutation.isSuccess, updateAssignmentMutation.isSuccess, createAssignmentMutation.data, updateAssignmentMutation.data, assignment, onSuccess]);

    const handleSubmit = async (data: AssignmentFormData) => {
        if (!user) {
            addToast({
                message: 'You must be logged in to create an assignment',
                type: 'error',
            });
            return;
        }

        if (assignment) {
            // Update existing assignment
            await updateAssignmentMutation.mutateAsync({
                assignmentId: assignment.id,
                assignmentData: data,
            });
        } else {
            // Create new assignment
            const newAssignment = {
                ...data,
            };

            await createAssignmentMutation.mutateAsync({
                moduleId: effectiveModuleId!,
                assignmentData: newAssignment,
            });
        }
    };

    return (
        <BaseForm<AssignmentFormData>
            initialValues={{
                title: assignment?.title || '',
                description: assignment?.description || '',
                dueDate: assignment?.dueDate ? assignment.dueDate.split('T')[0] : '',
            }}
            validationSchema={assignmentSchema}
            onSubmit={handleSubmit}
            onCancel={onCancel || (() => { })}
            isEdit={!!assignment}
            submitText={{ create: 'Create Assignment', update: 'Update Assignment' }}
            loadingText={{ create: 'Creating...', update: 'Updating...' }}
        >
            <AssignmentFormFields />
        </BaseForm>
    );
}