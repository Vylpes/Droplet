import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from 'react'
import { ApiError, authApi } from '../api/client'
import { AuthContext, type AuthContextValue } from './authContextShared'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthContextValue['user']>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refresh = useCallback(async () => {
        try {
            const response = await authApi.me()
            setUser(response.Data ?? null)
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                setUser(null)
                return
            }
            setUser(null)
            throw error
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            try {
                const response = await authApi.me()
                if (!cancelled) {
                    setUser(response.Data ?? null)
                }
            } catch (error) {
                if (!cancelled) {
                    // 401 means logged out — not an app error
                    if (!(error instanceof ApiError && error.status === 401)) {
                        console.error('Failed to load session', error)
                    }
                    setUser(null)
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const response = await authApi.login(email, password)
        setUser(response.Data ?? null)
    }, [])

    const logout = useCallback(async () => {
        try {
            await authApi.logout()
        } finally {
            setUser(null)
        }
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: user != null,
            isLoading,
            login,
            logout,
            refresh
        }),
        [user, isLoading, login, logout, refresh]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
