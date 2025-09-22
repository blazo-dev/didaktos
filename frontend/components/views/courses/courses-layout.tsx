"use client"

import { AppLayout } from "@/components/layout/app-layout";
import { useAuthStore } from "@/stores/auth-store";

function CoursesLayout() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <AppLayout showSidebar>
            <h1>Welcome back, {user?.name}</h1>
            <p>This is your courses dashboard.</p>
        </AppLayout>
    )
}

export default CoursesLayout