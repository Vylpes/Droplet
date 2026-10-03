import {
    useCallback,
    useMemo,
    useState,
    type ReactNode
} from 'react'
import {
    AlertContext,
    type Alert,
    type AlertContextValue,
    type AlertType
} from './alertContextShared'

let nextAlertId = 0

function createAlertId(): string {
    nextAlertId += 1
    return `alert-${nextAlertId}`
}

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([])

    const dismiss = useCallback((id: string) => {
        setAlerts((current) => current.filter((alert) => alert.id !== id))
    }, [])

    const push = useCallback((type: AlertType, message: string) => {
        setAlerts((current) => [
            ...current,
            { id: createAlertId(), type, message }
        ])
    }, [])

    const showInfo = useCallback(
        (message: string) => {
            push('info', message)
        },
        [push]
    )

    const showError = useCallback(
        (message: string) => {
            push('error', message)
        },
        [push]
    )

    const value = useMemo<AlertContextValue>(
        () => ({ alerts, showInfo, showError, dismiss }),
        [alerts, showInfo, showError, dismiss]
    )

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
