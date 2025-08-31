export interface LoginRequestDto {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterRequestDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}
