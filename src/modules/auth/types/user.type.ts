export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar_url?: string;
}