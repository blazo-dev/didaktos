"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

interface PasswordInputProps {
    id: string
    name: string
    placeholder: string
    required?: boolean
    className?: string
    label: string
    showHelper?: boolean
    helperText?: string
}

export function PasswordInput({
    id,
    name,
    placeholder,
    required = false,
    className = "",
    label,
    showHelper = false,
    helperText
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    name={name}
                    required={required}
                    className={`w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/80 transition-colors pr-12 ${className}`}
                    placeholder={placeholder}
                />
                <Button
                    type="button"
                    onClick={togglePassword}
                    size={"icon"}
                    variant={"ghost"}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                    {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                    ) : (
                        <EyeIcon className="w-5 h-5" />
                    )}
                </Button>
            </div>
            {showHelper && helperText && (
                <p className="text-xs text-muted-foreground mt-1">
                    {helperText}
                </p>
            )}
        </div>
    )
}