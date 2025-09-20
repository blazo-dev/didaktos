interface InputProps {
    id: string
    name: string
    type?: "text" | "email" | "tel" | "url"
    placeholder: string
    required?: boolean
    className?: string
    label: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Input({
    id,
    name,
    type = "text",
    placeholder,
    required = false,
    className = "",
    label,
    value,
    onChange
}: InputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/80 transition-colors ${className}`}
                placeholder={placeholder}
            />
        </div>
    )
}