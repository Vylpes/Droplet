import { Navigate, Outlet } from 'react-router'
import { useAuth } from './useAuth'

export function GuestRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="page-loading">Loading…</div>
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
