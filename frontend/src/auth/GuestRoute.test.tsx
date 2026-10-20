import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/render'
import { GuestRoute } from './GuestRoute'

function renderGuest(
    auth: NonNullable<Parameters<typeof renderWithProviders>[1]>['auth']
) {
    return renderWithProviders(
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/auth/login" element={<div>Login form</div>} />
            </Route>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>,
        {
            auth,
            initialEntries: ['/auth/login'],
        }
    )
}

describe('GuestRoute', () => {
    it('shows a loading state while auth is resolving', () => {
        renderGuest({ isLoading: true })

        expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('renders guest pages when unauthenticated', () => {
        renderGuest({ isAuthenticated: false, isLoading: false })

        expect(screen.getByText('Login form')).toBeInTheDocument()
    })

    it('redirects authenticated users to the dashboard', () => {
        renderGuest({ isAuthenticated: true, isLoading: false })

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.queryByText('Login form')).toBeNull()
    })
})
