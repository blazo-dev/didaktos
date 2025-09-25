"use client";

import { useSidebarStore } from "@/stores/sidebar-store";

/**
 * Custom hook for sidebar management
 * Provides convenient methods for controlling sidebar state
 */
export function useSidebar() {
    const {
        isOpen,
        isMobile,
        open,
        close,
        toggle,
        setIsMobile,
        shouldShowOverlay,
    } = useSidebarStore();

    return {
        // State
        isOpen,
        isMobile,
        shouldShowOverlay: shouldShowOverlay(),

        // Actions
        open,
        close,
        toggle,
        setIsMobile,

        // Computed helpers
        isDesktop: !isMobile,
        isVisible: isOpen,
        showMobileOverlay: isOpen && isMobile,
    };
}
