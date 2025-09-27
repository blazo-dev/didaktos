'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <Loader2
            className={cn(
                "animate-spin",
                size === 'sm' && "h-4 w-4",
                size === 'md' && "h-6 w-6",
                size === 'lg' && "h-8 w-8",
                className
            )}
        />
    );
}

interface LoadingStateProps {
    text: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingState({ text, size = 'md', className }: LoadingStateProps) {
    return (
        <div className={cn("flex items-center justify-center space-x-2", className)}>
            <LoadingSpinner size={size} />
            <span className={cn(
                size === 'sm' && "text-sm",
                size === 'md' && "text-base",
                size === 'lg' && "text-lg"
            )}>
                {text}
            </span>
        </div>
    );
}

interface InlineLoadingProps {
    text: string;
    className?: string;
}

export function InlineLoading({ text, className }: InlineLoadingProps) {
    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <LoadingSpinner size="sm" />
            <span className="text-sm">{text}</span>
        </div>
    );
}