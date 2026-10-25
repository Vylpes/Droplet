import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/render'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
    it('shows a 404 message and a link home', () => {
        renderWithProviders(<NotFoundPage />)

        expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { name: 'Not Found' })
        ).toBeInTheDocument()

        const homeLink = screen.getByRole('link', { name: /return home/i })
        expect(homeLink).toHaveAttribute('href', '/')
    })
})
