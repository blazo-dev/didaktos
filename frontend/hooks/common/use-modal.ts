import { ModalConfig, useModalStore } from "@/stores/ui-store";
import { useCallback } from "react";

export interface UseModalOptions {
    onClose?: () => void;
    onOpen?: () => void;
}

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
