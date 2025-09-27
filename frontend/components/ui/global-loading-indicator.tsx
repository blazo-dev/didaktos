import React from 'react';
import { useGlobalLoading } from '@/hooks/common/use-global-loading';
import { cn } from '@/lib/utils';

interface GlobalLoadingIndicatorProps {
  className?: string;
  position?: 'top' | 'bottom' | 'center';
  showProgress?: boolean;
  showOperationCount?: boolean;
}

/**
 * Global loading indicator that shows when any loading operations are active
 * Displays primary loading message and optional progress information
 */
export function GlobalLoadingIndicator({
  className,
  position = 'top',
  showProgress = true,
  showOperationCount = false,
}: GlobalLoadingIndicatorProps) {
  const {
    isLoading,
    primaryMessage,
    totalProgress,
    activeOperations,
    hasMultipleOperations,
  } = useGlobalLoading();

  if (!isLoading) return null;

  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-50',
    bottom: 'fixed bottom-0 left-0 right-0 z-50',
    center: 'fixed inset-0 z-50 flex items-center justify-center',
  };

  const progressWidth = totalProgress > 0 ? `${totalProgress}%` : '0%';
  const isIndeterminate = totalProgress === -1;

  return (
    <div
      className={cn(
        positionClasses[position],
        'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg',
        position !== 'center' && 'h-1',
        position === 'center' && 'bg-black/20 backdrop-blur-sm',
        className
      )}
    >
      {position === 'center' ? (
        // Center modal-style loading
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {primaryMessage}
              </p>
              {hasMultipleOperations && showOperationCount && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeOperations.length} operation{activeOperations.length !== 1 ? 's' : ''} running
                </p>
              )}
              {showProgress && totalProgress > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: progressWidth }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {totalProgress}% complete
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Top/bottom bar style loading
        <div className="relative h-full">
          {/* Background progress bar */}
          <div
            className={cn(
              'absolute top-0 left-0 h-full transition-all duration-300',
              isIndeterminate
                ? 'w-full animate-pulse'
                : 'bg-white/20'
            )}
            style={{ width: isIndeterminate ? '100%' : progressWidth }}
          />
          
          {/* Loading message overlay */}
          <div className="relative h-full flex items-center justify-center px-4">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
              <span>{primaryMessage}</span>
              {hasMultipleOperations && showOperationCount && (
                <span className="opacity-75">
                  ({activeOperations.length} operations)
                </span>
              )}
              {showProgress && totalProgress > 0 && (
                <span className="opacity-75">- {totalProgress}%</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact loading indicator for inline use
 */
export function CompactLoadingIndicator({ className }: { className?: string }) {
  const { isLoading, primaryMessage } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className={cn('inline-flex items-center space-x-2 text-sm', className)}>
      <div className="animate-spin rounded-full h-3 w-3 border border-blue-500 border-t-transparent" />
      <span className="text-blue-600 dark:text-blue-400">{primaryMessage}</span>
    </div>
  );
}

/**
 * Loading overlay for specific sections
 */
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}