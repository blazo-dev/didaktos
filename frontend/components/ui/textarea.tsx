import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps {
    id: string;
    label: string;
    placeholder: string;
    rows?: number;
    required?: boolean;
    className?: string;
    register?: UseFormRegisterReturn; // React Hook Form integration
    error?: string; // Inline error message
}

export function Textarea({
    id,
    label,
    placeholder,
    rows = 4,
    required = false,
    className = "",
    register,
    error
}: TextareaProps) {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <textarea
                id={id}
                required={required}
                placeholder={placeholder}
                rows={rows}
                {...register}
                className={`w-full px-4 py-3 border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/80 transition-colors resize-vertical ${error ? "border-red-500" : "border-border"} ${className}`}
            />
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
    );
}