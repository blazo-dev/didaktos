import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
    id: string;
    label: string;
    placeholder: string;
    type?: "text" | "email" | "tel" | "url" | "number" | "date";
    required?: boolean;
    className?: string;
    register?: UseFormRegisterReturn; // React Hook Form integration
    error?: string; // Inline error message
}

export function Input({
    id,
    label,
    placeholder,
    type = "text",
    required = false,
    className = "",
    register,
    error
}: InputProps) {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                required={required}
                placeholder={placeholder}
                {...register}
                className={`w-full px-4 py-3 border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/80 transition-colors ${error ? "border-red-500" : "border-border"} ${className}`}
            />
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
    );
}
