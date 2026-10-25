import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { OrdersListPage } from './OrdersListPage'

const list = vi.fn()

vi.mock('../../api/client', () => ({
    ordersApi: {
        list: (...args: unknown[]) => list(...args),
        create: vi.fn(),
    },
}))

describe('OrdersListPage', () => {
    beforeEach(() => {
        list.mockReset()
    })

    it('redirects invalid status slugs to awaiting-payment', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: { Orders: [], Listings: [], PostagePolicies: [] },
        })

        renderWithProviders(
            <Routes>
                <Route path="/orders/:status" element={<OrdersListPage />} />
                <Route
                    path="/orders/awaiting-payment"
                    element={<div>Awaiting payment list</div>}
                />
            </Routes>,
            { initialEntries: ['/orders/not-real'] }
        )

        expect(
            await screen.findByText('Awaiting payment list')
        ).toBeInTheDocument()
    })

    it('loads orders for the active status tab', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Orders: [
                    {
                        Id: 'o1',
                        WhenCreated: new Date().toISOString(),
                        WhenUpdated: new Date().toISOString(),
                        OrderNumber: 'ORD-100',
                        Price: 20,
                        OfferAccepted: false,
                        Status: 0,
                        StatusName: 'Awaiting Payment',
                        DispatchBy: new Date().toISOString(),
                        Buyer: 'alice',
                    },
                ],
                Listings: [],
                PostagePolicies: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route path="/orders/:status" element={<OrdersListPage />} />
            </Routes>,
            { initialEntries: ['/orders/awaiting-payment'] }
        )

        expect(screen.getByText('Loading…')).toBeInTheDocument()

        await waitFor(() => {
            expect(list).toHaveBeenCalledWith('awaiting-payment')
        })
        expect(await screen.findByText('ORD-100')).toBeInTheDocument()
        expect(screen.getByText('alice')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view/i })).toHaveAttribute(
            'href',
            '/orders/view/o1'
        )
    })
})
