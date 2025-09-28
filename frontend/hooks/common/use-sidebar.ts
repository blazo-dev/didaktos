"use client";

import { useSidebarStore } from "@/stores/ui-store";

/**
 * Sidebar state management hook for responsive navigation control
 *
 * @description Provides comprehensive sidebar control including open/close state,
 * mobile detection, and overlay management. Handles responsive behavior for
 * different screen sizes and provides computed helper properties.
 *
 * @returns {Object} Object containing:
 *   - isOpen: Boolean indicating if sidebar is currently open
 *   - isMobile: Boolean indicating if current viewport is mobile-sized
 *   - shouldShowOverlay: Boolean indicating if overlay should be displayed
 *   - open: Function to open the sidebar
 *   - close: Function to close the sidebar
 *   - toggle: Function to toggle sidebar open/closed state
 *   - setIsMobile: Function to update mobile state detection
 *   - isDesktop: Computed boolean opposite of isMobile
 *   - isVisible: Alias for isOpen for semantic clarity
 *   - showMobileOverlay: Computed boolean for mobile overlay display
 *
 * @example
 * ```tsx
 * const {
 *   isOpen,
 *   isMobile,
 *   toggle,
 *   close,
 *   showMobileOverlay
 * } = useSidebar();
 *
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle Sidebar</button>
 *     <Sidebar isOpen={isOpen} onClose={close} />
 *     {showMobileOverlay && <Overlay onClick={close} />}
 *   </div>
 * );
 * ```
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
