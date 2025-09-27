'use client';

import { Loader2 } from 'lucide-react';
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEdit ? loadingText.update : loadingText.create}
          </>
        ) : (
          isEdit ? submitText.update : submitText.create
        )}
      </Button>
    </div>
  );
}