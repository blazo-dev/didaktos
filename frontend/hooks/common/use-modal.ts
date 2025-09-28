import { ModalConfig, useModalStore } from "@/stores/ui-store";
import { useCallback } from "react";

export interface UseModalOptions {
    onClose?: () => void;
    onOpen?: () => void;
}

/**
 * Generic modal management hook for custom modal implementations
 *
 * @description Provides low-level modal control for custom modal implementations that
 * don't fit the predefined entity modal patterns. Manages modal state, open/close
 * operations, and optional lifecycle callbacks.
 *
 * @param {string} modalId - Unique identifier for the modal instance
 * @param {UseModalOptions} [options] - Optional configuration for modal lifecycle callbacks
 *
 * @returns {Object} Object containing:
 *   - isOpen: Boolean indicating if this modal is currently open
 *   - open: Function to open the modal with configuration
 *   - close: Function to close the modal
 *   - update: Function to update modal configuration while open
 *   - modal: Current modal configuration object or undefined
 *
 * @example
 * ```tsx
 * const { isOpen, open, close, update } = useModal('custom-modal-id', {
 *   onOpen: () => console.log('Modal opened'),
 *   onClose: () => console.log('Modal closed')
 * });
 *
 * const handleOpenModal = () => {
 *   open({
 *     title: "Custom Modal",
 *     size: "lg",
 *     closable: true,
 *     data: { customProp: 'value' }
 *   });
 * };
 *
 * const handleUpdateTitle = () => {
 *   update({ title: "Updated Title" });
 * };
 * ```
 */
export function useModal(modalId: string, options?: UseModalOptions) {
    const { isOpen, openModal, closeModal, updateModal, getModal } =
        useModalStore();

    const open = useCallback(
        (config: Omit<ModalConfig, "id">) => {
            openModal({ ...config, id: modalId });
            options?.onOpen?.();
        },
        [modalId, openModal, options]
    );

    const close = useCallback(() => {
        closeModal(modalId);
        options?.onClose?.();
    }, [modalId, closeModal, options]);

    const update = useCallback(
        (updates: Partial<ModalConfig>) => {
            updateModal(modalId, updates);
        },
        [modalId, updateModal]
    );

    return {
        isOpen: isOpen(modalId),
        open,
        close,
        update,
        modal: getModal(modalId),
    };
}
