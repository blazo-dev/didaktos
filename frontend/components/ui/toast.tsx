"use client"

import { CheckIcon, InfoIcon, TriangleAlertIcon, X, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = "info", duration = 2000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const typeConfig = {
        success: {
            bg: 'bg-green-500',
            icon: CheckIcon,
            iconBg: 'bg-green-400'
        },
        error: {
            bg: 'bg-red-500',
            icon: XIcon,
            iconBg: 'bg-red-400'
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: TriangleAlertIcon,
            iconBg: 'bg-yellow-400'
        },
        info: {
            bg: 'bg-blue-500',
            icon: InfoIcon,
            iconBg: 'bg-blue-400'
        },
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <div className={`relative ${isExiting ? 'animate-exit' : 'animate-enter'}`}>
            <div className={`${config.bg} text-white rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-white/20`}>
                <div className="flex items-start p-4">
                    <div className={`${config.iconBg} rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0`}>
                        {config.icon && <config.icon className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">{message}</p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="ml-3 text-white/80 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-white/10 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-1 bg-white/20">
                    <div
                        className="h-full bg-white/40 animate-progress"
                        style={{
                            animationDuration: `${duration}ms`,
                            animationPlayState: isExiting ? 'paused' : 'running'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
