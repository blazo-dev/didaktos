"use client";

import Loader from "@/components/layout/loader";
import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user)
            router.replace("/courses"); // Redirect if already logged in

    }, [isLoading, user, router]);

    if (isLoading) {
        return <Loader text="Checking authentication..." />;
    }

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
