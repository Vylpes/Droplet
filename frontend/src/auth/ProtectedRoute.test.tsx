import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { User } from '../api/client'
import { renderWithProviders } from '../test/render'
import { ProtectedRoute } from './ProtectedRoute'

const adminUser: User = {
    Id: '1',
    WhenCreated: new Date(),
    WhenUpdated: new Date(),
    Email: 'admin@example.com',
    Username: 'admin',
    Verified: true,
    Admin: true,
    Active: true,
}

function renderProtected({
    admin = false,
    auth,
}: {
    admin?: boolean
    auth: NonNullable<Parameters<typeof renderWithProviders>[1]>['auth']
}) {
    return renderWithProviders(
        <Routes>
            <Route element={<ProtectedRoute admin={admin} />}>
                <Route path="/secret" element={<div>Secret content</div>} />
            </Route>
            <Route path="/auth/login" element={<div>Login page</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>,
        {
            auth,
            initialEntries: ['/secret'],
        }
    )
}

describe('ProtectedRoute', () => {
    it('shows a loading state while auth is resolving', () => {
        renderProtected({ auth: { isLoading: true } })

        expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('redirects unauthenticated users to login', () => {
        renderProtected({
            auth: { isAuthenticated: false, isLoading: false },
        })

        expect(screen.getByText('Login page')).toBeInTheDocument()
        expect(screen.queryByText('Secret content')).toBeNull()
    })

    it('renders the outlet for authenticated users', () => {
        renderProtected({
            auth: {
                isAuthenticated: true,
                isLoading: false,
                user: adminUser,
            },
        })

        expect(screen.getByText('Secret content')).toBeInTheDocument()
    })

    it('redirects non-admins away from admin routes', () => {
        renderProtected({
            admin: true,
            auth: {
                isAuthenticated: true,
                isLoading: false,
                user: { ...adminUser, Admin: false },
            },
        })

        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.queryByText('Secret content')).toBeNull()
    })
})
