import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SidebarState {
    // State
    isOpen: boolean;
    isMobile: boolean;

    // Actions
    open: () => void;
    close: () => void;
    toggle: () => void;
    setIsMobile: (isMobile: boolean) => void;

    // Computed values
    shouldShowOverlay: () => boolean;
}

export const useSidebarStore = create<SidebarState>()(
    devtools(
        (set, get) => ({
            // Initial state - default to closed for better mobile experience
            isOpen: false,
            isMobile: false,

            // Actions
            open: () => set({ isOpen: true }, false, "sidebar/open"),

            close: () => set({ isOpen: false }, false, "sidebar/close"),

            toggle: () =>
                set(
                    (state) => ({ isOpen: !state.isOpen }),
                    false,
                    "sidebar/toggle"
                ),

            setIsMobile: (isMobile: boolean) =>
                set(
                    (state) => {
                        // On desktop, auto-open sidebar if not explicitly closed
                        // On mobile, keep sidebar closed by default
                        const newState = {
                            isMobile,
                            isOpen: !isMobile, // Auto-open on desktop, closed on mobile
                        };

                        return newState;
                    },
                    false,
                    "sidebar/setIsMobile"
                ),

            // Computed values
            shouldShowOverlay: () => {
                const { isOpen, isMobile } = get();
                return isOpen && isMobile;
            },
        }),
        {
            name: "sidebar-store",
        }
    )
);
