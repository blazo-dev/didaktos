"use client";

import { useToastStore } from "@/stores/ui-store";
import { useCallback, useRef } from "react";

export interface FormMetrics {
    submissionTime: number;
    validationTime: number;
    networkTime: number;
    totalTime: number;
    success: boolean;
    errorType?: string;
    formType: string;
}

export interface PerformanceConfig {
    enableLogging?: boolean;
    enableToasts?: boolean;
    slowThreshold?: number; // milliseconds
    onMetrics?: (metrics: FormMetrics) => void;
}

export function useFormPerformanceMonitoring(
    formType: string,
    config: PerformanceConfig = {}
) {
    const { addToast } = useToastStore();
    const metricsRef = useRef<Record<string, any>>({});

    const {
        enableLogging = process.env.NODE_ENV === "development",
        enableToasts = false,
        slowThreshold = 2000,
        onMetrics,
    } = config;

    const startTiming = useCallback(
        (phase: "submission" | "validation" | "network") => {
            metricsRef.current[`${phase}Start`] = performance.now();
        },
        []
    );

    const endTiming = useCallback(
        (phase: "submission" | "validation" | "network") => {
            const startTime = metricsRef.current[`${phase}Start`];
            if (startTime) {
                const endTime = performance.now();
                metricsRef.current[`${phase}Time`] = endTime - startTime;
            }
        },
        []
    );

    const recordSubmission = useCallback(
        async <T>(
            submissionFn: () => Promise<T>,
            validationFn?: () => Promise<boolean>
        ): Promise<T> => {
            const overallStart = performance.now();
            metricsRef.current = { formType };

            try {
                // Validation phase
                if (validationFn) {
                    startTiming("validation");
                    const isValid = await validationFn();
                    endTiming("validation");

                    if (!isValid) {
                        throw new Error("Validation failed");
                    }
                }

                // Submission phase
                startTiming("submission");
                startTiming("network");

                const result = await submissionFn();

                endTiming("network");
                endTiming("submission");

                // Calculate totals
                const overallEnd = performance.now();
                const totalTime = overallEnd - overallStart;

                const metrics: FormMetrics = {
                    submissionTime: metricsRef.current.submissionTime || 0,
                    validationTime: metricsRef.current.validationTime || 0,
                    networkTime: metricsRef.current.networkTime || 0,
                    totalTime,
                    success: true,
                    formType,
                };

                // Log performance metrics
                if (enableLogging) {
                    console.group(`📊 Form Performance: ${formType}`);
                    console.log(
                        "Validation Time:",
                        `${metrics.validationTime.toFixed(2)}ms`
                    );
                    console.log(
                        "Network Time:",
                        `${metrics.networkTime.toFixed(2)}ms`
                    );
                    console.log(
                        "Total Time:",
                        `${metrics.totalTime.toFixed(2)}ms`
                    );
                    console.groupEnd();
                }

                // Show slow performance toast
                if (enableToasts && totalTime > slowThreshold) {
                    addToast({
                        type: "warning",
                        message: `Form submission took ${(
                            totalTime / 1000
                        ).toFixed(1)}s. Consider checking your connection.`,
                    });
                }

                // Custom metrics callback
                onMetrics?.(metrics);

                return result;
            } catch (error) {
                const overallEnd = performance.now();
                const totalTime = overallEnd - overallStart;

                const metrics: FormMetrics = {
                    submissionTime: metricsRef.current.submissionTime || 0,
                    validationTime: metricsRef.current.validationTime || 0,
                    networkTime: metricsRef.current.networkTime || 0,
                    totalTime,
                    success: false,
                    errorType:
                        error instanceof Error ? error.name : "Unknown Error",
                    formType,
                };

                if (enableLogging) {
                    console.group(`❌ Form Error: ${formType}`);
                    console.error("Error:", error);
                    console.log("Time to Error:", `${totalTime.toFixed(2)}ms`);
                    console.groupEnd();
                }

                onMetrics?.(metrics);
                throw error;
            }
        },
        [
            formType,
            enableLogging,
            enableToasts,
            slowThreshold,
            addToast,
            onMetrics,
            startTiming,
            endTiming,
        ]
    );

    const getAverageMetrics = useCallback(() => {
        // In a real implementation, this would track metrics over time
        // For now, return the last recorded metrics
        return metricsRef.current;
    }, []);

    return {
        recordSubmission,
        getAverageMetrics,
        startTiming,
        endTiming,
    };
}

// Analytics helper for collecting form performance data
export function createFormAnalytics() {
    const metrics: FormMetrics[] = [];

    const recordMetrics = (formMetrics: FormMetrics) => {
        metrics.push(formMetrics);

        // Keep only last 100 submissions to prevent memory issues
        if (metrics.length > 100) {
            metrics.shift();
        }
    };

    const getAnalytics = (formType?: string) => {
        const filteredMetrics = formType
            ? metrics.filter((m) => m.formType === formType)
            : metrics;

        if (filteredMetrics.length === 0) {
            return null;
        }

        const avgSubmissionTime =
            filteredMetrics.reduce((sum, m) => sum + m.submissionTime, 0) /
            filteredMetrics.length;
        const avgNetworkTime =
            filteredMetrics.reduce((sum, m) => sum + m.networkTime, 0) /
            filteredMetrics.length;
        const avgTotalTime =
            filteredMetrics.reduce((sum, m) => sum + m.totalTime, 0) /
            filteredMetrics.length;
        const successRate =
            filteredMetrics.filter((m) => m.success).length /
            filteredMetrics.length;

        return {
            totalSubmissions: filteredMetrics.length,
            avgSubmissionTime,
            avgNetworkTime,
            avgTotalTime,
            successRate,
            slowestSubmission: Math.max(
                ...filteredMetrics.map((m) => m.totalTime)
            ),
            fastestSubmission: Math.min(
                ...filteredMetrics.map((m) => m.totalTime)
            ),
        };
    };

    return {
        recordMetrics,
        getAnalytics,
        getAllMetrics: () => [...metrics],
    };
}
