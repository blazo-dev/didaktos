"use client"

import { useSignIn } from "@/hooks/auth/use-signin";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { PasswordInput } from "./password-input";

interface SignInFormProps {
    onShowSignUp: () => void;
}

export function SignInForm({ onShowSignUp }: SignInFormProps) {
    const router = useRouter();
    const signInMutation = useSignIn();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        signInMutation.mutate({ email, password }, {
            onSuccess: () => {
                router.push("/courses");
            },
        });
    };

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
                    id="email-input"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    required
                />

                <PasswordInput
                    id="password-input"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                />

                <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
                    {signInMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                    <span className="text-muted-foreground">Don't have an account?</span>
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
    );
}
