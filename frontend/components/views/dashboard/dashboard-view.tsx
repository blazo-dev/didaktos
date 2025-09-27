"use client"

import Loader from "@/components/layout/loader";
import { useDashboardState } from "@/hooks/dashboard/use-dashboard-state";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardStats } from "./dashboard-stats";
import { RecentGrades } from "./recent-grades";
import { UpcomingAssignments } from "./upcoming-assignments";

export function DashboardView() {
    const { user } = useAuthStore();

    // Use the new optimized dashboard state hook
    const { 
        stats, 
        upcomingAssignments, 
        recentGrades, 
        isLoading, 
        isEmpty,
        quickStats,
        dashboardStatus,
        ownedCourses,
        enrolledCourses
    } = useDashboardState();
    
    // Create courses array for DashboardStats component compatibility
    const allCourses = [...ownedCourses, ...enrolledCourses];

    if (isLoading) {
        return <Loader text="Loading dashboard..." />;
    }

    if (isEmpty) {
        return (
            <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2 text-secondary">Welcome, {user?.name || "there"}!</h1>
                    <p className="text-muted-foreground mb-8">You haven't enrolled in any courses yet.</p>
                    <p className="text-muted-foreground">Visit the courses page to get started with your learning journey.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-secondary">Welcome back, {user?.name?.trim() ? user.name : "there"}!</h1>
                <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
                {quickStats.hasUpcomingWork && (
                    <p className="text-orange-600 text-sm mt-2">
                        🚨 You have {quickStats.needsAttention} assignment{quickStats.needsAttention !== 1 ? 's' : ''} due soon!
                    </p>
                )}
            </div>

            <DashboardStats courses={allCourses} stats={stats} userId={user?.id} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <UpcomingAssignments assignments={upcomingAssignments} />
                </div>

                <div className="space-y-8">
                    <RecentGrades grades={recentGrades} />
                </div>
            </div>
        </section>
    );
}