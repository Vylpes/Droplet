import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
    it('shows the in-development notice and action links', () => {
        render(<HomePage />)

        expect(
            screen.getByRole('heading', {
                name: /this site is currently in development/i,
            })
        ).toBeInTheDocument()
        // react-bootstrap Button with href exposes role="button"
        expect(
            screen.getByRole('button', { name: /view github/i })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /report a bug/i })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /join discord/i })
        ).toBeInTheDocument()
    })
})
