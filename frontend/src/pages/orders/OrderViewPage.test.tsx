import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { OrderViewPage } from './OrderViewPage'

const get = vi.fn()

vi.mock('../../api/client', () => ({
    ordersApi: {
        get: (...args: unknown[]) => get(...args),
        update: vi.fn(),
        paid: vi.fn(),
        dispatch: vi.fn(),
        discount: vi.fn(),
        assignListing: vi.fn(),
        assignSupply: vi.fn(),
        assignTrackingNumber: vi.fn(),
        addNote: vi.fn(),
    },
}))

describe('OrderViewPage', () => {
    beforeEach(() => {
        get.mockReset()
    })

    it('shows loading then order details', async () => {
        get.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Order: {
                    Id: 'o1',
                    WhenCreated: new Date().toISOString(),
                    WhenUpdated: new Date().toISOString(),
                    OrderNumber: 'ORD-100',
                    Price: 20,
                    OfferAccepted: true,
                    Status: 1,
                    StatusName: 'Awaiting Dispatch',
                    DispatchBy: '2024-06-15',
                    Buyer: 'alice',
                    Listings: [],
                    Supplies: [],
                    TrackingNumbers: [],
                },
                Listings: [],
                Supplies: [],
                PostagePolicies: [],
                Notes: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route path="/orders/view/:Id" element={<OrderViewPage />} />
            </Routes>,
            { initialEntries: ['/orders/view/o1'] }
        )

        expect(screen.getByText('Loading…')).toBeInTheDocument()

        await waitFor(() => {
            expect(get).toHaveBeenCalledWith('o1')
        })
        expect(
            await screen.findByRole('heading', { name: 'Order' })
        ).toBeInTheDocument()
        expect(screen.getByText('ORD-100')).toBeInTheDocument()
        expect(screen.getByText('alice')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /back to list/i })
        ).toHaveAttribute('href', '/orders/awaiting-payment')
    })

    it('shows an error when the order fails to load', async () => {
        get.mockRejectedValue(new Error('Not found'))

        renderWithProviders(
            <Routes>
                <Route path="/orders/view/:Id" element={<OrderViewPage />} />
            </Routes>,
            { initialEntries: ['/orders/view/missing'] }
        )

        expect(await screen.findByText('Not found')).toBeInTheDocument()
    })
})
