"use client"

import { useSignUp } from "@/hooks/auth/use-signup"
import Link from "next/link"
import { FormEvent } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { PasswordInput } from "./password-input"

export function SignUpForm() {
    const signUpMutation = useSignUp()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const userData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        signUpMutation.mutate(userData)
    }

    return (
        <div className="w-full grid gap-8 justify-content-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-muted-foreground">
                    Join Didaktos and start your learning journey
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="signup-name"
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    required
                />

                <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    required
                />

                <PasswordInput
                    id="signup-password"
                    name="password"
                    label="Password"
                    placeholder="Create a password"
                    required
                    showHelper
                    helperText="Password must be at least 8 characters long"
                />

                <PasswordInput
                    id="signup-confirm-password"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    required
                />

                <Button
                    type="submit"
                    variant={"secondary"}
                    className="w-full"
                    size={"lg"}

                >
                    Create Account
                </Button>

                <div className="text-center">
                    <span className="text-muted-foreground">
                        Already have an account?
                    </span>
                    <Button
                        variant={"link"}
                        className="p-0 pl-1"
                        asChild
                    >
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}