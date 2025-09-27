import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUISlice, UIState, UIActions } from "./slices/ui-slice";

export type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    (...args) => ({
      ...createUISlice(...args),
    }),
    { name: "ui-store" }
  )
);

// Export individual hooks for backward compatibility
export const useModalStore = () => {
  const store = useUIStore();
  return {
    modals: store.modals,
    isOpen: store.isModalOpen,
    openModal: store.openModal,
    closeModal: store.closeModal,
    closeAllModals: store.closeAllModals,
    updateModal: store.updateModal,
    getModal: store.getModal,
  };
};

export const useSidebarStore = () => {
  const store = useUIStore();
  return {
    isOpen: store.sidebar.isOpen,
    isMobile: store.sidebar.isMobile,
    open: store.openSidebar,
    close: store.closeSidebar,
    toggle: store.toggleSidebar,
    setIsMobile: store.setSidebarMobile,
    shouldShowOverlay: store.shouldShowOverlay,
  };
};

export const useToastStore = () => {
  const store = useUIStore();
  return {
    toasts: store.toasts,
    addToast: store.addToast,
    removeToast: store.removeToast,
  };
};