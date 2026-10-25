import { createContext } from 'react'

export type AlertType = 'info' | 'error'

export interface Alert {
    id: string
    type: AlertType
    message: string
}

export interface AlertContextValue {
    alerts: Alert[]
    showInfo: (message: string) => void
    showError: (message: string) => void
    dismiss: (id: string) => void
}

export const AlertContext = createContext<AlertContextValue | null>(null)
