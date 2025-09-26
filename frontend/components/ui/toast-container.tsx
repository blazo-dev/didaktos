"use client"

import { useToastStore } from "@/stores/toast-store"
import { Toast } from "./toast"


export function ToastContainer() {
    const { toasts, removeToast } = useToastStore()

    return (
        <div className="fixed top-4 right-4 z-[999] space-y-3 max-w-sm w-full">
            {toasts.map((t) => (
                <Toast
                    key={t.id}
                    message={t.message}
                    type={t.type}
                    duration={t.duration}
                    onClose={() => removeToast(t.id)}
                />
            ))}
        </div>
    )
}
