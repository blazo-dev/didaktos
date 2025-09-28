"use client";

import { useEffect, useState } from "react";

const LG_BREAKPOINT = 1024; // Tailwind's lg breakpoint

/**
 * Custom hook for detecting mobile screen size (viewport width < 1024px)
 * 
 * @description Tracks viewport width and returns a boolean indicating if the screen is mobile-sized.
 * Uses Tailwind's lg breakpoint (1024px) as the threshold for mobile vs desktop.
 * 
 * @returns {boolean} True if viewport width is less than 1024px (mobile), false otherwise
 * 
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`);
        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(mql.matches);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
