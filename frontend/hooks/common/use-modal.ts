import { ModalConfig, useModalStore } from "@/stores/modal-store";
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

// Predefined modal configurations for common use cases
export const MODAL_IDS = {
    CREATE_COURSE: "create-course",
    EDIT_COURSE: "edit-course",
    DELETE_COURSE: "delete-course",
    CREATE_MODULE: "create-module",
    EDIT_MODULE: "edit-module",
    DELETE_MODULE: "delete-module",
    CREATE_LESSON: "create-lesson",
    EDIT_LESSON: "edit-lesson",
    DELETE_LESSON: "delete-lesson",
} as const;

export type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];
