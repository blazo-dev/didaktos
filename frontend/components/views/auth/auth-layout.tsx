"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";

export function AuthLayout() {
    const [showSignUp, setShowSignUp] = useState(false);
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace("/courses"); // Redirect to courses if already logged in
        }
    }, [user, router]);


    const handleShowSignUp = () => setShowSignUp(true);
    const handleShowSignIn = () => setShowSignUp(false);

    return (
        <div className="space-y-8 g-container gap-6">
            <div className="h-full grid place-items-center">
                <div className="w-full max-w-lg py-8">
                    {!showSignUp && <SignInForm onShowSignUp={handleShowSignUp} />}
                    {showSignUp && <SignUpForm onShowSignIn={handleShowSignIn} />}
                </div>
            </div>
        </div>
    );
}
