"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./loader";

interface ProtectedPageProps {
    loadingText?: string;
    children: React.ReactNode;
}

function ProtectedPage({ children, loadingText = "Checking credentials..." }: ProtectedPageProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isLoading && !user && isHydrated) {
            router.replace("/auth/signin");
        }
    }, [isLoading, user, router, isHydrated]);

    // Always show loader during SSR and initial hydration
    if (!isHydrated || isLoading) {
        return <Loader text={loadingText} />;
    }

    if (!user) return null;

    return <>{children}</>;
}

export default ProtectedPage;
