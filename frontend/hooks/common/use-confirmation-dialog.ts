"use client";

import { useModalStore } from "@/stores/ui-store";
import { useCallback } from "react";

export interface ConfirmationConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
}

/**
 * Confirmation dialog hook for destructive or important actions
 *
 * @description Provides standardized confirmation dialogs for actions like deletions,
 * data modifications, or other irreversible operations. Uses the modal system to
 * display confirmation prompts with customizable messages and button text.
 *
 * @returns {Object} Object containing:
 *   - confirm: Generic function to show confirmation dialog with custom config
 *   - confirmDeletion: Predefined function for delete confirmations
 *   - confirmModuleDeletion: Specialized function for module deletion confirmations
 *
 * @example
 * ```tsx
 * const { confirmDeletion, confirm } = useConfirmationDialog();
 *
 * const handleDeleteCourse = async () => {
 *   const confirmed = await confirmDeletion("Introduction to React", "course");
 *   if (confirmed) {
 *     deleteCourse.mutate(courseId);
 *   }
 * };
 *
 * const handleCustomAction = async () => {
 *   const confirmed = await confirm({
 *     title: "Publish Course",
 *     message: "This will make the course visible to all students.",
 *     confirmText: "Publish",
 *     type: "info"
 *   });
 *   if (confirmed) publishCourse();
 * };
 * ```
 */
export function useConfirmationDialog() {
    const { openModal, closeModal } = useModalStore();

    const confirm = useCallback(
        async (config: ConfirmationConfig): Promise<boolean> => {
            const {
                title,
                message,
                confirmText = "Confirm",
                cancelText = "Cancel",
                type = "info",
            } = config;

            return new Promise<boolean>((resolve) => {
                const modalId = `confirmation-${Date.now()}`;

                openModal({
                    id: modalId,
                    title: title,
                    size: "sm",
                    closable: true,
                    backdrop: true,
                    data: {
                        message,
                        confirmText,
                        cancelText,
                        type,
                        onConfirm: () => {
                            closeModal(modalId);
                            resolve(true);
                        },
                        onCancel: () => {
                            closeModal(modalId);
                            resolve(false);
                        },
                    },
                });
            });
        },
        [openModal, closeModal]
    );

    const confirmDeletion = useCallback(
        async (
            itemName: string,
            itemType: string = "item"
        ): Promise<boolean> => {
            return confirm({
                title: `Delete ${itemType}`,
                message: `Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`,
                confirmText: "Delete",
                cancelText: "Cancel",
                type: "danger",
            });
        },
        [confirm]
    );

    const confirmModuleDeletion = useCallback(
        async (moduleName: string): Promise<boolean> => {
            return confirm({
                title: "Delete Module",
                message: `Are you sure you want to delete "${moduleName}"?\n\nThis will permanently remove:\n• All lessons in this module\n• All assignments in this module\n• All student submissions\n\nThis action cannot be undone.`,
                confirmText: "Delete Module",
                cancelText: "Cancel",
                type: "danger",
            });
        },
        [confirm]
    );

    return {
        confirm,
        confirmDeletion,
        confirmModuleDeletion,
    };
}
