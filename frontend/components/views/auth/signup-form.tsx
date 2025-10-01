"use client";

import { PasswordInput } from "@/components/ui/password-input";
import { useSignUp } from "@/hooks/auth/use-signup";
import { signUpSchema } from "@/lib/schemas/auth";
import { SignUpRequest } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export function SignUpForm() {
    const signUpMutation = useSignUp();

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpRequest>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur", // helpful for confirmPassword validation
    });

    const onSubmit = (data: SignUpRequest) => {
        signUpMutation.mutate(data);
    };

    return (
        <div className="w-full grid gap-8 justify-content-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-muted-foreground">Join Didaktos and start your learning journey</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    id="signup-name"
                    label="Name"
                    placeholder="Enter your name"
                    required
                    register={register("name")}
                    error={errors.name?.message}
                />

                <Input
                    id="signup-email"
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    required
                    register={register("email")}
                    error={errors.email?.message}
                />

                <PasswordInput
                    id="signup-password"
                    label="Password"
                    placeholder="Create a password"
                    required
                    showHelper
                    helperText="Password must be at least 8 characters long"
                    register={register("password")}
                    error={errors.password?.message}
                />

                <PasswordInput
                    id="signup-confirm-password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    required
                    register={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                <Button type="submit" variant="secondary" className="w-full" size="lg">
                    Create Account
                </Button>

                <div className="text-center">
                    <span className="text-muted-foreground">Already have an account?</span>
                    <Button variant="link" className="p-0 pl-1" asChild>
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
