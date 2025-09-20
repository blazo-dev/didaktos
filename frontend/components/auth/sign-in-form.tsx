"use client"

import { FormEvent } from "react"
import { Button } from "../ui/button"
import { PasswordInput } from "./password-input"
import { Input } from "../ui/input"

interface SignInFormProps {
    onShowSignUp: () => void
}

export function SignInForm({ onShowSignUp }: SignInFormProps) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle form submission logic here
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')
        console.log('Sign in:', { email, password })
    }

    return (
        <div className="w-full grid gap-8 justify-content-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">
                    Sign in to your Didaktos account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    required
                />

                <PasswordInput
                    id="signin-password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                />

                {/* <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-secondary border-border rounded focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Remember me
                        </span>
                    </label>
                    <a
                        href="#"
                        className="text-sm text-secondary hover:text-secondary/80 transition-colors"
                    >
                        Forgot password?
                    </a>
                </div> */}

                <Button
                    type="submit"
                    variant={"secondary"}
                    className="w-full"
                    size={"lg"}
                >
                    Sign In
                </Button>

                <div className="text-center">
                    <span className="text-muted-foreground">
                        Don't have an account?
                    </span>
                    <Button
                        type="button"
                        variant={"link"}
                        className="p-0 pl-1"
                        onClick={onShowSignUp}
                    >
                        Sign up
                    </Button>
                </div>
            </form>
        </div>
    )
}