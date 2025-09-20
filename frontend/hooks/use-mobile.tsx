"use client";

import { useEffect, useState } from "react";

const LG_BREAKPOINT = 1024; // Tailwind's lg breakpoint

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < LG_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < LG_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
