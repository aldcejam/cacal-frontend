import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

/** Redireciona para / se o usuário já estiver autenticado (ex: página de login) */
export const GuestRoute = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
