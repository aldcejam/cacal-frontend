import Cookies from 'js-cookie';
import { create } from 'zustand';
import type { UserRes } from '../api/services/user/@types/UserRes';

const COOKIE_KEY = 'cacal_auth';
const COOKIE_EXPIRES_DAYS = 7;

interface AuthState {
    user: UserRes | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: UserRes, token: string) => void;
    logout: () => void;
}

function loadFromCookie(): Pick<AuthState, 'user' | 'token'> {
    try {
        const raw = Cookies.get(COOKIE_KEY);
        if (!raw) return { user: null, token: null };
        return JSON.parse(raw);
    } catch {
        return { user: null, token: null };
    }
}

const persisted = loadFromCookie();

export const useAuthStore = create<AuthState>((set) => ({
    user: persisted.user,
    token: persisted.token,
    isAuthenticated: !!persisted.token,

    login: (user, token) => {
        Cookies.set(COOKIE_KEY, JSON.stringify({ user, token }), {
            expires: COOKIE_EXPIRES_DAYS,
            sameSite: 'Strict',
        });
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        Cookies.remove(COOKIE_KEY);
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
