import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ReturnsListPage } from './ReturnsListPage'

const list = vi.fn()

vi.mock('../../api/client', () => ({
    returnsApi: {
        list: (...args: unknown[]) => list(...args),
        create: vi.fn(),
    },
}))

describe('ReturnsListPage', () => {
    beforeEach(() => {
        list.mockReset()
    })

    it('redirects invalid status slugs to opened', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: { Returns: [], Orders: [] },
        })

        renderWithProviders(
            <Routes>
                <Route path="/returns/:status" element={<ReturnsListPage />} />
                <Route
                    path="/returns/opened"
                    element={<div>Opened returns</div>}
                />
            </Routes>,
            { initialEntries: ['/returns/bad-status'] }
        )

        expect(await screen.findByText('Opened returns')).toBeInTheDocument()
    })

    it('loads returns for the active status tab', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Returns: [
                    {
                        Id: 'r1',
                        WhenCreated: new Date().toISOString(),
                        WhenUpdated: new Date().toISOString(),
                        ReturnNumber: 'RET-55',
                        RMA: 'RMA-55',
                        ReturnBy: '2024-06-01',
                        Status: 0,
                        StatusName: 'Opened',
                        RefundAmount: 0,
                        Order: {
                            Id: 'o1',
                            WhenCreated: new Date().toISOString(),
                            WhenUpdated: new Date().toISOString(),
                            OrderNumber: 'ORD-55',
                            Price: 10,
                            OfferAccepted: true,
                            Status: 2,
                            StatusName: 'Dispatched',
                            DispatchBy: '2024-05-01',
                            Buyer: 'bob',
                        },
                    },
                ],
                Orders: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route path="/returns/:status" element={<ReturnsListPage />} />
            </Routes>,
            { initialEntries: ['/returns/opened'] }
        )

        await waitFor(() => {
            expect(list).toHaveBeenCalledWith('opened')
        })
        expect(await screen.findByText('RET-55')).toBeInTheDocument()
        expect(screen.getByText('RMA-55')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view/i })).toHaveAttribute(
            'href',
            '/returns/view/r1'
        )
    })
})
