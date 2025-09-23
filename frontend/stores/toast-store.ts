import { Toast } from "@/types/toast";
import { create } from "zustand";

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id: toastId++ }],
        })),
    removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
