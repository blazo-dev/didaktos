import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ModalConfig {
    id: string;
    title: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    closable?: boolean;
    backdrop?: boolean;
    data?: any;
}

interface ModalState {
    modals: ModalConfig[];
    isOpen: (id: string) => boolean;
    openModal: (config: ModalConfig) => void;
    closeModal: (id: string) => void;
    closeAllModals: () => void;
    updateModal: (id: string, updates: Partial<ModalConfig>) => void;
    getModal: (id: string) => ModalConfig | undefined;
}

export const useModalStore = create<ModalState>()(
    devtools(
        (set, get) => ({
            modals: [],

            isOpen: (id: string) => {
                return get().modals.some((modal) => modal.id === id);
            },

            openModal: (config: ModalConfig) => {
                set((state) => {
                    // Remove existing modal with same ID if it exists
                    const filteredModals = state.modals.filter(
                        (modal) => modal.id !== config.id
                    );
                    return {
                        modals: [
                            ...filteredModals,
                            {
                                size: "md",
                                closable: true,
                                backdrop: true,
                                ...config,
                            },
                        ],
                    };
                });
            },

            closeModal: (id: string) => {
                set((state) => ({
                    modals: state.modals.filter((modal) => modal.id !== id),
                }));
            },

            closeAllModals: () => {
                set({ modals: [] });
            },

            updateModal: (id: string, updates: Partial<ModalConfig>) => {
                set((state) => ({
                    modals: state.modals.map((modal) =>
                        modal.id === id ? { ...modal, ...updates } : modal
                    ),
                }));
            },

            getModal: (id: string) => {
                return get().modals.find((modal) => modal.id === id);
            },
        }),
        { name: "modal-store" }
    )
);
