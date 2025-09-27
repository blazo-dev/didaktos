'use client';

import { useModalStore } from '@/stores/ui-store';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../../ui/button';
import { Modal } from '../../ui/modal';

interface ConfirmationModalProps {
    modalId: string;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel?: () => void;
}

export function ConfirmationModal({
    modalId,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info',
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
    const { closeModal } = useModalStore();

    const handleConfirm = () => {
        onConfirm();
        closeModal(modalId);
    };

    const handleCancel = () => {
        onCancel?.();
        closeModal(modalId);
    };

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertTriangle className="h-6 w-6 text-destructive" />;
            case 'warning':
                return <AlertCircle className="h-6 w-6 text-orange-500" />;
            default:
                return <Info className="h-6 w-6 text-blue-500" />;
        }
    };

    const getConfirmButtonVariant = () => {
        switch (type) {
            case 'danger':
                return 'destructive' as const;
            case 'warning':
                return 'secondary' as const;
            default:
                return 'default' as const;
        }
    };

    return (
        <Modal id={modalId} onClose={handleCancel}>
            <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                    {getIcon()}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>

                <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {message}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={getConfirmButtonVariant()}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}