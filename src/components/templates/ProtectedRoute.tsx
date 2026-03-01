import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

/** Redireciona para /auth/login se o usuário não estiver autenticado */
export const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};
