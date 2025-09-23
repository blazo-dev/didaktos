"use client";

import { PasswordInput } from "@/components/ui/password-input";
import { useSignIn } from "@/hooks/auth/use-signin";
import { signInSchema } from "@/lib/schemas/auth";
import { SignInRequest } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export function SignInForm() {
    const router = useRouter();
    const signInMutation = useSignIn();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm<SignInRequest>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data: SignInRequest) => {
        signInMutation.mutate(data, {
            onSuccess: () => router.push("/courses"),
        });
    };

    return (
        <div className="w-full grid gap-8 justify-content-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">Sign in to your Didaktos account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    id="email-input"
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    required
                    register={register("email")}
                    error={errors.email?.message}
                />

                <PasswordInput
                    id="password-input"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    register={register("password")}
                    error={errors.password?.message}
                />

                <Button
                    type="submit"
                    variant="secondary"
                    className="w-full"
                    disabled={signInMutation.isPending}
                >
                    {signInMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                    <span className="text-muted-foreground">Don't have an account?</span>
                    <Button variant="link" size={"lg"} className="p-0 pl-1" asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
