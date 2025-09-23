export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface User {
    id: string;
    name: string;
    email: string;
}
