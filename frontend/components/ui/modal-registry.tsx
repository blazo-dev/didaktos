'use client';

import { useModalStore } from '@/stores/ui-store';
import { ConfirmationModal } from '../modals/common/confirmation-modal';

// Central Modal Registry - renders all types of modals
export function ModalRegistry() {
    const { modals } = useModalStore();

    return (
        <>
            {modals.map((modal) => {
                // Handle confirmation modals
                if (modal.data?.onConfirm && modal.data?.onCancel) {
                    return (
                        <ConfirmationModal
                            key={modal.id}
                            modalId={modal.id}
                            title={modal.title}
                            message={modal.data.message}
                            confirmText={modal.data.confirmText}
                            cancelText={modal.data.cancelText}
                            type={modal.data.type}
                            onConfirm={modal.data.onConfirm}
                            onCancel={modal.data.onCancel}
                        />
                    );
                }

                // For other modal types, they handle their own rendering
                return null;
            })}
        </>
    );
}