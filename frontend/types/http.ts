export interface HttpResponse<T> {
    success: boolean;
    data: T;
    status: number;
    message: string;
    errors?: string[] | null | Record<string, string>[];
}
