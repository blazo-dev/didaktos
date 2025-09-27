import { StateCreator } from "zustand";
import { Toast } from "@/types/toast";

export interface ModalConfig {
  id: string;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  backdrop?: boolean;
  data?: any;
}

export interface SidebarConfig {
  isOpen: boolean;
  isMobile: boolean;
}

export interface UIState {
  modals: ModalConfig[];
  sidebar: SidebarConfig;
  toasts: Toast[];
}

export interface UIActions {
  // Modal actions
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  getModal: (id: string) => ModalConfig | undefined;
  isModalOpen: (id: string) => boolean;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
  
  // Sidebar actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarMobile: (isMobile: boolean) => void;
  shouldShowOverlay: () => boolean;
  
  // Toast actions
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

let toastId = 0;

export const createUISlice: StateCreator<
  UIState & UIActions,
  [],
  [],
  UIState & UIActions
> = (set, get) => ({
  // Initial state
  modals: [],
  sidebar: { isOpen: false, isMobile: false },
  toasts: [],

  // Modal actions
  openModal: (config) => set((state) => {
    const filteredModals = state.modals.filter(m => m.id !== config.id);
    return {
      modals: [...filteredModals, {
        size: "md",
        closable: true,
        backdrop: true,
        ...config,
      }],
    };
  }),

  closeModal: (id) => set((state) => ({
    modals: state.modals.filter(m => m.id !== id),
  })),

  closeAllModals: () => set({ modals: [] }),

  getModal: (id) => get().modals.find(m => m.id === id),

  isModalOpen: (id) => get().modals.some(m => m.id === id),

  updateModal: (id, updates) => set((state) => ({
    modals: state.modals.map(modal =>
      modal.id === id ? { ...modal, ...updates } : modal
    ),
  })),

  // Sidebar actions
  openSidebar: () => set((state) => ({ 
    sidebar: { ...state.sidebar, isOpen: true }
  })),

  closeSidebar: () => set((state) => ({ 
    sidebar: { ...state.sidebar, isOpen: false }
  })),

  toggleSidebar: () => set((state) => ({ 
    sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen }
  })),

  setSidebarMobile: (isMobile) => set((state) => ({
    sidebar: { 
      isMobile, 
      isOpen: !isMobile // Auto-open on desktop, closed on mobile
    }
  })),

  shouldShowOverlay: () => {
    const { sidebar } = get();
    return sidebar.isOpen && sidebar.isMobile;
  },

  // Toast actions
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: toastId++ }],
  })),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id),
  })),
});