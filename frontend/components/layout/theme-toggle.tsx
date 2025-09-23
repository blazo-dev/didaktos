"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Mark the component as mounted on client
    useEffect(() => setMounted(true), []);

    if (!mounted || !theme) return null; // wait until theme is available

    const isDark = theme === "dark";

    return (
        <Button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun /> : <Moon />}
        </Button>
    );
}
