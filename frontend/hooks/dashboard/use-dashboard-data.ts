"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Course } from "@/types/course";
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

export function useDashboardData(courses: Course[]): DashboardData {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    const enrolledCourses = useMemo(() => {
        if (!userId) return [];
        return courses.filter((course) => course.enrollments.includes(userId));
    }, [courses, userId]);

    const stats: DashboardStats = useMemo(() => {
        const activeCourses = enrolledCourses.length;

        const allAssignments = enrolledCourses.flatMap((c) =>
            c.modules.flatMap((m) => m.assignments)
        );

        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const dueThisWeek = allAssignments.filter((a) => {
            const due = new Date(a.dueDate);
            return due >= now && due <= nextWeek;
        }).length;

        return {
            activeCourses,
            dueThisWeek,
            completedCourses: 0,
            avgGrade: 0,
        };
    }, [enrolledCourses]);

    const currentCourses = enrolledCourses;

    const upcomingAssignments = useMemo(() => {
        return enrolledCourses.flatMap((course) =>
            course.modules.flatMap((m) =>
                m.assignments.map((a) => ({
                    id: a.id,
                    title: a.title,
                    courseTitle: course.title,
                    dueDate: a.dueDate,
                }))
            )
        );
    }, [enrolledCourses]);

    const recentGrades: DashboardData["recentGrades"] = [
        {
            id: "g1",
            title: "Midterm Exam",
            courseTitle: "CS 101",
            grade: "A-",
        },
    ];

    return {
        stats,
        currentCourses,
        upcomingAssignments,
        recentGrades,
    };
}
