"use client"

import { Course } from "@/types/course"
import { DashboardStats as DashboardStatsType } from "@/hooks/dashboard/use-dashboard-data" // Import the stats type
import { Book, CheckCircle, Clipboard, TrendingUp } from "lucide-react"

interface StatCardProps {
    icon: React.ReactNode
    value: string | number
    label: string
    bgColor: string
}

function StatCard({ icon, value, label, bgColor }: StatCardProps) {
    return (
        <div className="bg-surface border border-surface-border rounded-lg p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-2xl font-bold text-secondary">{value}</p>
                    <p className="text-muted-foreground text-sm">{label}</p>
                </div>
            </div>
        </div>
    )
}

interface DashboardStatsProps {
    courses: Course[];
    stats: DashboardStatsType; // Add the stats from your dashboard hook
}

export function DashboardStats({ courses, stats }: DashboardStatsProps) {
    // Use the actual stats from the dashboard hook
     const activeCourses = courses?.length || 0
    const dueThisWeek = stats.dueThisWeek;
    // const avgGrade = stats.avgGrade > 0 ? `${stats.avgGrade}%` : "N/A";

    const statsCards = [
        {
            icon: <Book className="w-6 h-6 text-blue-600" />,
            value: activeCourses,
            label: "Active Courses",
            bgColor: "bg-blue-600/40"
        },
        {
            icon: <Clipboard className="w-6 h-6 text-orange-600" />,
            value: dueThisWeek,
            label: "Due This Week",
            bgColor: "bg-orange-600/40"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
            value: "87%",
            label: "Avg Grade",
            bgColor: "bg-purple-600/40"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    )
}