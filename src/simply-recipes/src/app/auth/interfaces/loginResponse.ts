export interface LoginResponse {
    userId: string;
    email: string;
    username: string;
    isAdmin: boolean;
    token: string;
    isAuthSuccessful: boolean;
    errors: string;
}