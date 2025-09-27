'use client';

import { useCallback } from 'react';

export interface ConfirmationConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export function useConfirmationDialog() {
    const confirm = useCallback(async (config: ConfirmationConfig): Promise<boolean> => {
        const {
            title,
            message,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
        } = config;

        // For now, use browser's native confirm dialog
        // TODO: Replace with custom modal component
        return window.confirm(`${title}\n\n${message}`);
    }, []);

    const confirmDeletion = useCallback(async (itemName: string, itemType: string = 'item'): Promise<boolean> => {
        return confirm({
            title: `Delete ${itemType}`,
            message: `Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
    }, [confirm]);

    const confirmModuleDeletion = useCallback(async (moduleName: string): Promise<boolean> => {
        return window.confirm(
            `Are you sure you want to delete "${moduleName}"?\n\n` +
            `This will permanently remove:\n` +
            `• All lessons in this module\n` +
            `• All assignments in this module\n` +
            `• All student submissions\n\n` +
            `This action cannot be undone.`
        );
    }, []);

    return {
        confirm,
        confirmDeletion,
        confirmModuleDeletion
    };
}