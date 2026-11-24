export interface AuthUser {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    initializing: boolean;
    error: string | null;
}