import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../test/render'
import { Alerts } from './Alerts'

describe('Alerts', () => {
    it('renders nothing when there are no alerts', () => {
        const { container } = renderWithProviders(<Alerts />)

        expect(container).toBeEmptyDOMElement()
    })

    it('renders info and error alerts with dismiss controls', async () => {
        const user = userEvent.setup()
        const dismiss = vi.fn()

        renderWithProviders(<Alerts />, {
            alerts: {
                alerts: [
                    { id: 'a1', type: 'info', message: 'Saved' },
                    { id: 'a2', type: 'error', message: 'Failed' },
                ],
                dismiss,
            },
        })

        expect(screen.getByRole('status')).toHaveTextContent('Saved')
        expect(screen.getByRole('alert')).toHaveTextContent('Failed')

        const closeButtons = screen.getAllByRole('button', { name: /close/i })
        await user.click(closeButtons[0])
        expect(dismiss).toHaveBeenCalledWith('a1')
    })
})
