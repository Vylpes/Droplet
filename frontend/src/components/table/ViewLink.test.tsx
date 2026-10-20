import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ViewLink } from './ViewLink'

describe('ViewLink', () => {
    it('links to the given path with the default label', () => {
        renderWithProviders(<ViewLink to="/orders/view/abc" />)

        const link = screen.getByRole('link', { name: /view/i })
        expect(link).toHaveAttribute('href', '/orders/view/abc')
    })

    it('supports a custom label', () => {
        renderWithProviders(<ViewLink to="/items/1" label="Open" />)

        expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument()
    })
})
