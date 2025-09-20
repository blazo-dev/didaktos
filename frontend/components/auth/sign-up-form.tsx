"use client"

import { FormEvent } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { PasswordInput } from "./password-input"
import { Select } from "../ui/select"

interface SignUpFormProps {
    onShowSignIn: () => void
}

export function SignUpForm({ onShowSignIn }: SignUpFormProps) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Handle form submission logic here
        const formData = new FormData(e.currentTarget)
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            role: formData.get('role'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        }
        console.log('Sign up:', userData)
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        id="signup-firstname"
                        name="firstName"
                        label="First Name"
                        placeholder="First name"
                        required
                    />
                    <Input
                        id="signup-lastname"
                        name="lastName"
                        label="Last Name"
                        placeholder="Last name"
                        required
                    />
                </div>

                <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    required
                />

                <Select
                    id="signup-role"
                    name="role"
                    label="I am a"
                    placeholder="Select your role"
                    required
                    options={[
                        { value: "student", label: "Student" },
                        { value: "instructor", label: "Instructor" },
                        { value: "admin", label: "Administrator" }
                    ]}
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