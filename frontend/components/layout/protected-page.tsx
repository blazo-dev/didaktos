"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./loader";

interface ProtectedPageProps {
    loadingText?: string;
    children: React.ReactNode;
}

function ProtectedPage({ children, loadingText = "Checking credentials..." }: ProtectedPageProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/auth/signin");
        }
    }, [isLoading, user, router]);

    if (isLoading) return <Loader text={loadingText} />;
    if (!user) return null;

    return <>{children}</>;
}

export default ProtectedPage;
