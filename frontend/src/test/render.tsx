import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import {
    AuthContext,
    type AuthContextValue,
} from '../auth/authContextShared'
import {
    AlertContext,
    type AlertContextValue,
} from '../alerts/alertContextShared'

const defaultAuth: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    refresh: async () => {},
}

const defaultAlerts: AlertContextValue = {
    alerts: [],
    showInfo: () => {},
    showError: () => {},
    dismiss: () => {},
}

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
    auth?: Partial<AuthContextValue>
    alerts?: Partial<AlertContextValue>
    initialEntries?: string[]
}

function Providers({
    children,
    auth,
    alerts,
    initialEntries,
}: {
    children: ReactNode
    auth?: Partial<AuthContextValue>
    alerts?: Partial<AlertContextValue>
    initialEntries?: string[]
}) {
    return (
        <AuthContext.Provider value={{ ...defaultAuth, ...auth }}>
            <AlertContext.Provider value={{ ...defaultAlerts, ...alerts }}>
                <MemoryRouter initialEntries={initialEntries ?? ['/']}>
                    {children}
                </MemoryRouter>
            </AlertContext.Provider>
        </AuthContext.Provider>
    )
}

export function renderWithProviders(
    ui: ReactElement,
    options: RenderWithProvidersOptions = {}
) {
    const { auth, alerts, initialEntries, ...renderOptions } = options

    return render(ui, {
        wrapper: ({ children }) => (
            <Providers
                auth={auth}
                alerts={alerts}
                initialEntries={initialEntries}
            >
                {children}
            </Providers>
        ),
        ...renderOptions,
    })
}
