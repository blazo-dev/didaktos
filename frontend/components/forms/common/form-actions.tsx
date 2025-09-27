'use client';

import { LoadingSpinner } from '../../ui/loading-states';
import { Button } from '../../ui/button';

interface FormActionsProps {
    onCancel: () => void;
    isPending: boolean;
    isEdit: boolean;
    submitText?: { create: string; update: string };
    loadingText?: { create: string; update: string };
    cancelText?: string;
}

export function FormActions({
    onCancel,
    isPending,
    isEdit,
    submitText = { create: 'Create', update: 'Update' },
    loadingText = { create: 'Creating...', update: 'Updating...' },
    cancelText = 'Cancel'
}: FormActionsProps) {
    return (
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
            >
                {cancelText}
            </Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? (
                    <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {isEdit ? loadingText.update : loadingText.create}
                    </>
                ) : (
                    isEdit ? submitText.update : submitText.create
                )}
            </Button>
        </div>
    );
}