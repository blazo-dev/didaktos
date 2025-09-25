"use client"

import { useCourses } from "@/hooks/courses/use-courses";
import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import { DashboardStats } from "./dashboard-stats"
import { RecentGrades } from "./recent-grades"
import { StudyAssistant } from "../assistant/study-assistant"
import { UpcomingAssignments } from "./upcoming-assignments"
import Loader from "@/components/layout/loader";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardView() {
    const { data: maybeCourses, isLoading } = useCourses();
    const courses = maybeCourses || [];
    const { user } = useAuthStore();
    
    // Use the dashboard hook to get processed data
    const dashboardData = useDashboardData(courses);

    if (isLoading) {
        return <Loader text="Loading dashboard..." />;
    }

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-secondary">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
            </div>

            <DashboardStats courses={courses} stats={dashboardData.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Pass the upcoming assignments from the dashboard hook */}
                    <UpcomingAssignments assignments={dashboardData.upcomingAssignments} />
                </div>

                <div className="space-y-8">
                    <RecentGrades grades={dashboardData.recentGrades} />
                </div>
            </div>
            <StudyAssistant />
        </section>
    )
}