'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useModalStore } from '@/stores/modal-store';
import { XIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    id: string;
    children: React.ReactNode;
    onClose?: () => void;
}

export function Modal({ id, children, onClose }: ModalProps) {
    const { modals, closeModal, getModal } = useModalStore();
    const modal = getModal(id);
    const isOpen = modals.some(m => m.id === id);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && modal?.closable !== false) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, modal?.closable]);

    const handleClose = () => {
        closeModal(id);
        onClose?.();
    };

    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget && modal?.backdrop !== false) {
            handleClose();
        }
    };

    if (!isOpen || !modal) {
        return null;
    }

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <Card
                className={`w-full ${sizeClasses[modal.size || 'md']} p-0 gap-0 max-h-[90vh] overflow-hidden animate-slide-in-from-bottom-4`}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">
                        {modal.title}
                    </h2>
                    {modal.closable !== false && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                        >
                            <XIcon />
                        </Button>
                    )}
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>
            </Card>
        </div>
    );

    return createPortal(modalContent, document.body);
}

// Modal Provider Component
export function ModalProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ModalRenderer />
        </>
    );
}

// Modal Renderer - renders all active modals
function ModalRenderer() {
    const { modals } = useModalStore();

    return (
        <>
            {modals.map((modal) => (
                <div key={modal.id} id={`modal-${modal.id}`} />
            ))}
        </>
    );
}