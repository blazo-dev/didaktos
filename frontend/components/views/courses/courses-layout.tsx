"use client"

import { useAuthStore } from "@/stores/auth-store";

function CoursesLayout() {
    const { user } = useAuthStore();

    return (
        <div>
            <h1>Welcome back, {user?.name}</h1>
            <p>This is your courses dashboard.</p>
        </div>
    )
}

export default CoursesLayout