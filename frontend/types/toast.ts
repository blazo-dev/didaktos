export interface Toast {
    id: number;
    message: string;
    type?: "error" | "success" | "info" | "warning";
    duration?: number;
}
