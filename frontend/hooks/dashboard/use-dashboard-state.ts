import { useErrorHandling } from "@/hooks/common/use-error-handling";
import { useCourses } from "@/hooks/courses/use-courses";
import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";

interface DashboardStats {
    activeCourses: number;
    dueThisWeek: number;
    completedCourses: number;
    avgGrade: number;
}

interface UpcomingAssignment {
    id: string;
    title: string;
    courseTitle: string;
    dueDate: string;
    daysUntilDue?: number;
}

interface RecentGrade {
    id: string;
    title: string;
    courseTitle: string;
    grade: string;
}

/**
 * Optimized dashboard state management hook
 * Processes course data efficiently with proper memoization
 */
export function useDashboardState() {
    const { data: courses = [], isLoading: coursesLoading } = useCourses();
    const { user } = useAuthStore();
    const { reportError } = useErrorHandling();

    // Process dashboard data with comprehensive memoization
    const dashboardData = useMemo(() => {
        try {
            if (!user) {
                return {
                    stats: {} as DashboardStats,
                    upcomingAssignments: [],
                    recentGrades: [],
                    ownedCourses: [],
                    enrolledCourses: [],
                };
            }

            // Categorize courses
            const ownedCourses = courses.filter(
                (c) => c.instructor.id === user.id
            );
            const enrolledCourses = courses.filter(
                (c) =>
                    c.enrollments.includes(user.id) &&
                    c.instructor.id !== user.id
            );

            // Extract all assignments with course context
            const allAssignments = courses.flatMap((course) =>
                course.modules.flatMap((module) =>
                    module.assignments.map((assignment) => ({
                        ...assignment,
                        courseName: course.title,
                        moduleTitle: module.title,
                        courseId: course.id,
                        isOwned: course.instructor.id === user.id,
                    }))
                )
            );

            // Calculate upcoming assignments (next 30 days)
            const now = new Date();
            const thirtyDaysFromNow = new Date(
                now.getTime() + 30 * 24 * 60 * 60 * 1000
            );

            const upcomingAssignments: UpcomingAssignment[] = allAssignments
                .filter((assignment) => {
                    const dueDate = new Date(assignment.dueDate);
                    return dueDate > now && dueDate <= thirtyDaysFromNow;
                })
                .map((assignment) => {
                    const dueDate = new Date(assignment.dueDate);
                    const daysUntilDue = Math.ceil(
                        (dueDate.getTime() - now.getTime()) /
                            (24 * 60 * 60 * 1000)
                    );
                    return {
                        id: assignment.id,
                        title: assignment.title,
                        courseTitle: assignment.courseName,
                        dueDate: assignment.dueDate,
                        daysUntilDue,
                    };
                })
                .sort(
                    (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                )
                .slice(0, 5);

            // Calculate recent grades (last 2 weeks)
            const twoWeeksAgo = new Date(
                now.getTime() - 14 * 24 * 60 * 60 * 1000
            );

            const recentGrades: RecentGrade[] = allAssignments
                .flatMap((assignment) =>
                    (assignment.submissions || [])
                        .filter(
                            (submission) =>
                                submission.grade !== undefined &&
                                submission.grade !== null &&
                                submission.submittedAt &&
                                new Date(submission.submittedAt) >= twoWeeksAgo
                        )
                        .map((submission) => ({
                            id:
                                submission.id ||
                                `${assignment.id}-${submission.studentId}`,
                            title: assignment.title,
                            courseTitle: assignment.courseName,
                            grade: String(submission.grade),
                        }))
                )
                .sort((a, b) => {
                    const gradeA = parseInt(a.grade);
                    const gradeB = parseInt(b.grade);
                    // Handle NaN values by putting them at the end
                    if (isNaN(gradeA) && isNaN(gradeB)) return 0;
                    if (isNaN(gradeA)) return 1;
                    if (isNaN(gradeB)) return -1;
                    return gradeB - gradeA;
                })
                .slice(0, 5);

            // Calculate comprehensive stats to match existing interface
            const totalLessons = courses.reduce(
                (acc, course) =>
                    acc +
                    course.modules.reduce(
                        (moduleAcc, module) =>
                            moduleAcc + module.lessons.length,
                        0
                    ),
                0
            );

            const totalAssignments = allAssignments.length;
            const completedAssignments = allAssignments.filter(
                (assignment) =>
                    assignment.submissions && assignment.submissions.length > 0
            ).length;

            // Calculate next week's due assignments
            const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const dueThisWeek = upcomingAssignments.filter((assignment) => {
                const dueDate = new Date(assignment.dueDate);
                return dueDate >= now && dueDate <= nextWeek;
            }).length;

            const gradesArray = recentGrades
                .map((g) => parseInt(g.grade))
                .filter((grade) => !isNaN(grade)); // Filter out invalid grades
            const avgGrade =
                gradesArray.length > 0
                    ? Math.round(
                          gradesArray.reduce((sum, grade) => sum + grade, 0) /
                              gradesArray.length
                      )
                    : 0;

            const stats: DashboardStats = {
                activeCourses: enrolledCourses.length,
                dueThisWeek,
                completedCourses: 0, // Not used in current implementation
                avgGrade,
            };

            return {
                stats,
                upcomingAssignments,
                recentGrades,
                ownedCourses,
                enrolledCourses,
            };
        } catch (error) {
            // Report error and return empty state
            reportError(error as Error, {
                severity: "medium",
                component: "useDashboardState",
                action: "processing dashboard data",
            });

            return {
                stats: {} as DashboardStats,
                upcomingAssignments: [],
                recentGrades: [],
                ownedCourses: [],
                enrolledCourses: [],
            };
        }
    }, [courses, user, reportError]);

    // Additional computed properties
    const dashboardStatus = useMemo(() => {
        if (coursesLoading)
            return { status: "loading", message: "Loading dashboard..." };
        if (courses.length === 0)
            return { status: "empty", message: "No courses found" };
        if (!user) return { status: "unauthorized", message: "Please log in" };
        return { status: "ready", message: "Dashboard loaded" };
    }, [coursesLoading, courses.length, user]);

    const quickStats = useMemo(
        () => ({
            hasUpcomingWork: dashboardData.upcomingAssignments.length > 0,
            hasRecentGrades: dashboardData.recentGrades.length > 0,
            needsAttention: dashboardData.upcomingAssignments.filter(
                (a) => a.daysUntilDue !== undefined && a.daysUntilDue <= 3
            ).length,
            totalCourses:
                dashboardData.ownedCourses.length +
                dashboardData.enrolledCourses.length,
        }),
        [dashboardData]
    );

    return {
        // Processed data
        ...dashboardData,

        // Status and loading
        isLoading: coursesLoading,
        dashboardStatus,

        // Quick stats for UI
        quickStats,

        // Computed flags
        isEmpty: courses.length === 0,
        hasData: courses.length > 0,
        isStudent: dashboardData.enrolledCourses.length > 0,
        isInstructor: dashboardData.ownedCourses.length > 0,
        isMixed:
            dashboardData.ownedCourses.length > 0 &&
            dashboardData.enrolledCourses.length > 0,
    };
}
