"use client"

import { useState } from "react"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

export function AuthLayout() {
    const [showSignUp, setShowSignUp] = useState(false)

    const handleShowSignUp = () => {
        setShowSignUp(true)
    }

    const handleShowSignIn = () => {
        setShowSignUp(false)
    }

    return (
        <div className="space-y-8 g-container gap-6">
            {/* Auth Forms */}
            <div className="h-full grid place-items-center">
                <div className="w-full max-w-lg py-8">
                    {!showSignUp && (
                        <SignInForm onShowSignUp={handleShowSignUp} />
                    )}
                    {showSignUp && (
                        <SignUpForm onShowSignIn={handleShowSignIn} />
                    )}
                </div>
            </div>
        </div>
    )
}