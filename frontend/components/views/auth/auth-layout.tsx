"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace("/courses"); // Redirect to courses if already logged in
        }
    }, [user, router]);


    return (
        <div className="space-y-8 g-container gap-6">
            <div className="h-full grid place-items-center">
                <div className="w-full max-w-lg py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
