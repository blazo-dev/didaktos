"use client"

import { useCourses } from "@/hooks/courses/use-courses";
import { CurrentCourses } from "./current-courses"
import { DashboardStats } from "./dashboard-stats"
import { RecentGrades } from "./recent-grades"
import { StudyAssistant } from "../assistant/study-assistant"
import { UpcomingAssignments } from "./upcoming-assignments"
import Loader from "@/components/layout/loader";

export function DashboardView() {
    const { data: maybeCourses, isLoading } = useCourses();
    const courses = maybeCourses || [];

    if (isLoading) {
        return <Loader text="Loading dashboard..." />;
    }
    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-secondary">Welcome back, John!</h1>
                <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
            </div>

            <DashboardStats courses={courses} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <CurrentCourses />
                    <UpcomingAssignments />
                </div>

                <div className="space-y-8">
                    <RecentGrades />
                </div>
            </div>
            <StudyAssistant />
        </section>

    )
}