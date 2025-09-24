"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Button } from "./button";

interface PasswordInputProps {
    id: string;
    label: string;
    placeholder: string;
    required?: boolean;
    className?: string;
    showHelper?: boolean;
    helperText?: string;
    register?: UseFormRegisterReturn; // React Hook Form integration
    error?: string; // Inline error message
}

export function PasswordInput({
    id,
    label,
    placeholder,
    required = false,
    className = "",
    showHelper = false,
    helperText,
    register,
    error
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    required={required}
                    placeholder={placeholder}
                    {...register}
                    className={`w-full px-4 py-3 border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/80 transition-colors pr-12 ${error ? "border-red-500" : "border-border"} ${className}`}
                />
                <Button
                    type="button"
                    onClick={togglePassword}
                    size="icon"
                    variant="ghost"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </Button>
            </div>
            {!error && showHelper && helperText && (
                <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
            )}
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
    );
}
