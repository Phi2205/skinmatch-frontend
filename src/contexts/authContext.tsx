"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
    login as loginApi,
    logout as logoutApi,
    register as registerApi,
    refresh as refreshApi
} from '@/modules/auth/services/auth.service';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User } from '@/modules/auth/types/user.type';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, redirectPath?: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { setItem, getItem, removeItem } = useLocalStorage();

    // Check for user session on mount
    useEffect(() => {
        const storedUser = getItem('user') as User | null;
        if (storedUser) {
            setUser(storedUser);
            // Tự động đồng bộ lại cookie từ LocalStorage (Sống trong 30 ngày)
            document.cookie = `user_id=${storedUser.id}; path=/; max-age=2592000; SameSite=Lax`;
            document.cookie = `user_role=${storedUser.role}; path=/; max-age=2592000; SameSite=Lax`;
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string, redirectPath?: string) => {
        try {
            setIsLoading(true);
            const response = await loginApi({ email, password });
            if (response.success && response.data.user) {
                const userData = response.data.user;
                setUser(userData);
                setItem('user', userData);
                document.cookie = `user_id=${userData.id}; path=/; max-age=2592000; SameSite=Lax`;
                document.cookie = `user_role=${userData.role}; path=/; max-age=2592000; SameSite=Lax`;
                // Redirect based on role or custom redirectPath
                if (redirectPath) {
                    router.push(redirectPath);
                } else if (userData.role === 'ADMIN') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router, setItem]);

    const register = useCallback(async (email: string, password: string, name: string) => {
        try {
            setIsLoading(true);
            const response = await registerApi({ email, password, name });

            if (response.success) {
                // If the backend returns user data after registration, store it
                const userData = response.data?.user;
                if (userData) {
                    setUser(userData);
                    setItem('user', userData);
                    // Set cookie 30 ngày
                    document.cookie = `user_id=${userData.id}; path=/; max-age=2592000; SameSite=Lax`;
                    document.cookie = `user_role=${userData.role}; path=/; max-age=2592000; SameSite=Lax`;
                    router.push('/');
                } else {
                    // Otherwise redirect to verify OTP or login
                    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router, setItem]);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await logoutApi();
            setUser(null);
            removeItem('user');
            removeItem('cart');
            removeItem('skinmatch_guest_session_id');

            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout API fails, clear local state
            setUser(null);
            removeItem('user');
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router, removeItem]);

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        setItem('user', updatedUser);
        // Cập nhật lại cookie 30 ngày
        document.cookie = `user_id=${updatedUser.id}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `user_role=${updatedUser.role}; path=/; max-age=2592000; SameSite=Lax`;
    }, [setItem]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
    }), [user, isLoading, login, register, logout, updateUser]);

    return <AuthContext.Provider value={ value }>
        { children }
        </AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
