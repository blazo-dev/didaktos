"use client"

import { useAuth } from "@/hooks/auth/use-auth";
import Loader from "./loader";

interface ProtectedPageProps {
    loadingText: string;
    children: React.ReactNode;
}


function ProtectedPage({ children, loadingText }: ProtectedPageProps) {

    const { user, isLoading } = useAuth();

    if (isLoading) return <Loader text={loadingText} />;
    if (!user) return null;

    return (
        <>{children}</>
    )
}

export default ProtectedPage