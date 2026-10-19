import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ReturnViewPage } from './ReturnViewPage'

const get = vi.fn()

vi.mock('../../api/client', () => ({
    returnsApi: {
        get: (...args: unknown[]) => get(...args),
        update: vi.fn(),
        started: vi.fn(),
        posted: vi.fn(),
        received: vi.fn(),
        refund: vi.fn(),
        close: vi.fn(),
        addNote: vi.fn(),
    },
}))

describe('ReturnViewPage', () => {
    beforeEach(() => {
        get.mockReset()
    })

    it('shows loading then return details', async () => {
        get.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Return: {
                    Id: 'r1',
                    WhenCreated: new Date().toISOString(),
                    WhenUpdated: new Date().toISOString(),
                    ReturnNumber: 'RET-55',
                    RMA: 'RMA-55',
                    ReturnBy: '2024-06-01',
                    Status: 0,
                    StatusName: 'Opened',
                    RefundAmount: 0,
                    TrackingNumbers: [],
                },
                Notes: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route path="/returns/view/:Id" element={<ReturnViewPage />} />
            </Routes>,
            { initialEntries: ['/returns/view/r1'] }
        )

        expect(screen.getByText('Loading…')).toBeInTheDocument()

        await waitFor(() => {
            expect(get).toHaveBeenCalledWith('r1')
        })
        expect(
            await screen.findByRole('heading', { name: 'Return' })
        ).toBeInTheDocument()
        expect(screen.getByText('RET-55')).toBeInTheDocument()
        expect(screen.getByText('RMA-55')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /back to list/i })
        ).toHaveAttribute('href', '/returns/opened')
    })

    it('shows an error when the return fails to load', async () => {
        get.mockRejectedValue(new Error('Not found'))

        renderWithProviders(
            <Routes>
                <Route path="/returns/view/:Id" element={<ReturnViewPage />} />
            </Routes>,
            { initialEntries: ['/returns/view/missing'] }
        )

        expect(await screen.findByText('Not found')).toBeInTheDocument()
    })
})
