'use client';

import { ReactNode, useState } from 'react';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export function Tooltip({
    content,
    children,
    position = 'top',
    delay = 500
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
            case 'bottom':
                return 'top-full left-1/2 -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 -translate-y-1/2 ml-2';
            default:
                return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
        }
    };

    const getArrowClasses = () => {
        switch (position) {
            case 'top':
                return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-muted';
            case 'bottom':
                return 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-muted';
            case 'left':
                return 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-muted';
            case 'right':
                return 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-muted';
            default:
                return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-muted';
        }
    };

    return (
        <div
            className="relative flex-1"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {isVisible && (
                <div className={`absolute w-full z-50 ${getPositionClasses()}`}>
                    <div className="bg-muted text-foreground text-xs rounded-lg px-3 py-2 shadow-lg whitespace-normal">
                        {content}
                        <div
                            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}