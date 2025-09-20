"use client"

import { FormEvent } from "react"
import { Button } from "../ui/button"
import { PasswordInput } from "./password-input"

interface SignUpFormProps {
    onShowSignIn: () => void
}

export function SignUpForm({ onShowSignIn }: SignUpFormProps) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle form submission logic here
        const formData = new FormData(e.currentTarget)
        const userData = {
            firstName: formData.get('firstname'),
            lastName: formData.get('lastname'),
            email: formData.get('email'),
            role: formData.get('role'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        }
        console.log('Sign up:', userData)
    }

    return (
        <div className="w-full grid gap-8 justify-content-center">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-muted-foreground">
                    Join Didaktos and start your learning journey
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="signup-firstname" className="block text-sm font-medium mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="signup-firstname"
                            name="firstname"
                            required
                            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            placeholder="First name"
                        />
                    </div>
                    <div>
                        <label htmlFor="signup-lastname" className="block text-sm font-medium mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="signup-lastname"
                            name="lastname"
                            required
                            className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            placeholder="Last name"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="signup-email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label htmlFor="signup-role" className="block text-sm font-medium mb-2">
                        I am a
                    </label>
                    <select
                        id="signup-role"
                        name="role"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    >
                        <option value="">Select your role</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>

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

                <button
                    type="submit"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                    Create Account
                </button>

                <div className="text-center">
                    <span className="text-muted-foreground">
                        Already have an account?
                    </span>
                    <Button
                        type="button"
                        variant={"link"}
                        className="p-0 pl-1"
                        onClick={onShowSignIn}
                    >
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
    )
}