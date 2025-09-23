interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    id: string
    name: string
    placeholder: string
    required?: boolean
    className?: string
    label: string
    options: SelectOption[]
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function Select({
    id,
    name,
    placeholder,
    required = false,
    className = "",
    label,
    options,
    value,
    onChange
}: SelectProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <select
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/80 transition-colors ${className}`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}