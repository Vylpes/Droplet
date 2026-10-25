import { useAuth } from '../../auth/useAuth'

export function DashboardPage() {
    const { user } = useAuth()

    return (
        <>
            <h1>Dashboard</h1>
            <p>Logged in as {user?.Username}</p>
        </>
    )
}
