"use client"

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

export function DashboardStats() {
    const stats = [
        {
            icon: <Book className="w-6 h-6 text-blue-600" />,
            value: 5,
            label: "Active Courses",
            bgColor: "bg-blue-600/40"
        },
        {
            icon: <Clipboard className="w-6 h-6 text-orange-600" />,
            value: 3,
            label: "Due This Week",
            bgColor: "bg-orange-600/40"
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            value: 12,
            label: "Completed",
            bgColor: "bg-green-600/40"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
            value: "87%",
            label: "Avg Grade",
            bgColor: "bg-purple-600/40"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    )
}