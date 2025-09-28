"use client";

import { submissionsApi } from "@/lib/api/submission";
import { useAuthStore } from "@/stores/auth-store";
import { Course } from "@/types/course";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export interface DashboardStats {
    activeCourses: number;
    dueThisWeek: number;
    completedCourses: number;
    avgGrade: number;
}

export interface DashboardData {
    stats: DashboardStats;
    currentCourses: Course[];
    upcomingAssignments: {
        id: string;
        title: string;
        courseTitle: string;
        dueDate: string;
    }[];
    recentGrades: {
        id: string;
        title: string;
        courseTitle: string;
        grade: string;
    }[];
}

/**
 * Comprehensive dashboard data aggregation hook
 *
 * @description Processes course data to generate dashboard statistics, recent activity,
 * upcoming deadlines, and course progress. Fetches submission data for each course
 * in parallel using useQueries for optimal performance. Memoizes computations to
 * prevent unnecessary recalculations.
 *
 * @param {Course[]} courses - Array of courses to analyze for dashboard data
 *
 * @returns {DashboardData} Object containing:
 *   - stats: Dashboard statistics (active courses, due assignments, avg grade, etc.)
 *   - currentCourses: Array of courses user is currently enrolled in
 *   - upcomingAssignments: Array of upcoming assignment deadlines
 *   - recentGrades: Array of recently graded submissions
 *
 * @example
 * ```tsx
 * const { data: courses = [] } = useCourses();
 * const { stats, recentGrades, upcomingAssignments } = useDashboardData(courses);
 *
 * return (
 *   <Dashboard>
 *     <StatsCards stats={stats} />
 *     <GradesFeed grades={recentGrades} />
 *     <AssignmentsList assignments={upcomingAssignments} />
 *   </Dashboard>
 * );
 * ```
 */
export function useDashboardData(courses: Course[]): DashboardData {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    const enrolledCourses = useMemo(() => {
        if (!userId) return [];
        return courses.filter((course) => course.enrollments?.includes(userId));
    }, [courses, userId]);

    // Fetch submissions for each enrolled course
    const submissionQueries = useQueries({
        queries: enrolledCourses.map((course) => ({
            queryKey: ["course-submissions", course.id],
            queryFn: () => submissionsApi.getCourseSubmissions(course.id),
            enabled: !!userId,
        })),
    });

    // Combine all submissions from all courses
    const allSubmissions = useMemo(() => {
        return submissionQueries
            .filter((query) => query.data)
            .flatMap((query) => query.data || []);
    }, [submissionQueries]);

    const stats: DashboardStats = useMemo(() => {
        const activeCourses = enrolledCourses.length;

        // Get assignment IDs that have grades from current user's submissions
        const gradedAssignmentIds = new Set(
            allSubmissions
                .filter(
                    (submission) =>
                        submission.studentId === userId &&
                        submission.grade !== null &&
                        submission.grade !== undefined
                )
                .map((submission) => submission.assignmentId)
        );

        // Filter out graded assignments from all assignments
        const ungradedAssignments = enrolledCourses.flatMap((c) =>
            c.modules?.flatMap((m) =>
                m.assignments.filter((a) => !gradedAssignmentIds.has(a.id))
            )
        );

        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const dueThisWeek = ungradedAssignments.filter((a) => {
            const due = new Date(a!.dueDate);
            return due >= now && due <= nextWeek;
        }).length;

        // Calculate average grade from submissions for current user
        const userGradedSubmissions = allSubmissions.filter(
            (s) =>
                s.studentId === userId &&
                s.grade !== null &&
                s.grade !== undefined
        );

        const avgGrade =
            userGradedSubmissions.length > 0
                ? Math.round(
                      userGradedSubmissions.reduce(
                          (sum, s) => sum + s.grade!,
                          0
                      ) / userGradedSubmissions.length
                  )
                : 0;

        return {
            activeCourses,
            dueThisWeek,
            completedCourses: 0,
            avgGrade,
        };
    }, [enrolledCourses, allSubmissions, userId]);

    const currentCourses = enrolledCourses;

    const upcomingAssignments = useMemo(() => {
        // Get assignment IDs that have grades from current user's submissions
        const gradedAssignmentIds = new Set(
            allSubmissions
                .filter(
                    (submission) =>
                        submission.studentId === userId &&
                        submission.grade !== null &&
                        submission.grade !== undefined
                )
                .map((submission) => submission.assignmentId)
        );

        return enrolledCourses
            .flatMap(
                (course) =>
                    course.modules?.flatMap((m) =>
                        m.assignments
                            // Filter out assignments that already have grades
                            .filter((a) => !gradedAssignmentIds.has(a.id))
                            .map((a) => ({
                                id: a.id,
                                title: a.title,
                                courseTitle: course.title,
                                dueDate: a.dueDate,
                            }))
                    ) || []
            )
            .filter(
                (
                    a
                ): a is {
                    id: string;
                    title: string;
                    courseTitle: string;
                    dueDate: string;
                } => !!a
            );
    }, [enrolledCourses, allSubmissions, userId]);

    // Get recent grades from submissions data
    const recentGrades: DashboardData["recentGrades"] = useMemo(() => {
        if (!allSubmissions.length || !userId) {
            return [];
        }

        // Create a map of assignments for quick lookup
        const assignmentMap = new Map();
        enrolledCourses.forEach((course) => {
            course.modules?.forEach((module) => {
                module.assignments.forEach((assignment) => {
                    assignmentMap.set(assignment.id, {
                        title: assignment.title,
                        courseTitle: course.title,
                    });
                });
            });
        });

        // Filter submissions with grades for current user and map to recent grades format
        const gradedSubmissions = allSubmissions
            .filter(
                (submission) =>
                    submission.studentId === userId &&
                    submission.grade !== null &&
                    submission.grade !== undefined
            )
            .map((submission) => {
                const assignmentInfo = assignmentMap.get(
                    submission.assignmentId
                );
                return {
                    id: submission.id ?? "", // Ensure id is always a string
                    title: assignmentInfo?.title || "Unknown Assignment",
                    courseTitle:
                        assignmentInfo?.courseTitle || "Unknown Course",
                    grade: submission.grade!.toString(),
                    submittedAt: submission.submittedAt,
                };
            })
            // Remove potential duplicates by submission ID
            .filter(
                (submission, index, array) =>
                    array.findIndex((s) => s.id === submission.id) === index
            )
            // Sort by submission date (most recent first) and take the first 5
            .sort((a, b) => {
                const aTime = a.submittedAt
                    ? new Date(a.submittedAt).getTime()
                    : -Infinity;
                const bTime = b.submittedAt
                    ? new Date(b.submittedAt).getTime()
                    : -Infinity;
                return bTime - aTime;
            })
            .slice(0, 5)
            .map(({ submittedAt, ...grade }) => grade); // Remove submittedAt from final result

        return gradedSubmissions;
    }, [allSubmissions, enrolledCourses, userId]);

    return {
        stats,
        currentCourses,
        upcomingAssignments,
        recentGrades,
    };
}
