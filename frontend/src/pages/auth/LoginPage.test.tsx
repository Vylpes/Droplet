import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
    it('renders login fields and helper links', () => {
        renderWithProviders(<LoginPage />)

        expect(screen.getByLabelText('Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /forgot password/i })
        ).toHaveAttribute('href', '/auth/password-reset/request')
        expect(
            screen.getByRole('link', { name: /didn't receive invite/i })
        ).toHaveAttribute('href', '/auth/verification-token/request')
    })

    it('submits credentials and navigates to the redirect target', async () => {
        const user = userEvent.setup()
        const login = vi.fn().mockResolvedValue(undefined)

        renderWithProviders(
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/items" element={<div>Items page</div>} />
            </Routes>,
            {
                auth: { login },
                initialEntries: [
                    {
                        pathname: '/auth/login',
                        state: { from: { pathname: '/items' } },
                    },
                ],
            }
        )

        await user.type(screen.getByLabelText('Email'), 'a@b.com')
        await user.type(screen.getByLabelText('Password'), 'secret')
        await user.click(screen.getByRole('button', { name: /^login$/i }))

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('a@b.com', 'secret')
        })
        expect(await screen.findByText('Items page')).toBeInTheDocument()
    })
})
