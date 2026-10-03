import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth'

interface ProtectedRouteProps {
    admin?: boolean
}

export function ProtectedRoute({ admin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <div className="page-loading">Loading…</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />
    }

    if (admin && !user?.Admin) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
