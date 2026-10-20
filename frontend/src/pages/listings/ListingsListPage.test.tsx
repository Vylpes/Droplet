import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ListingsListPage } from './ListingsListPage'

const list = vi.fn()

vi.mock('../../api/client', () => ({
    listingsApi: {
        list: (...args: unknown[]) => list(...args),
        create: vi.fn(),
    },
}))

describe('ListingsListPage', () => {
    beforeEach(() => {
        list.mockReset()
    })

    it('redirects invalid status slugs to active', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: { Listings: [], Items: [] },
        })

        renderWithProviders(
            <Routes>
                <Route
                    path="/listings/:status"
                    element={<ListingsListPage />}
                />
                <Route
                    path="/listings/active"
                    element={<div>Active listings</div>}
                />
            </Routes>,
            { initialEntries: ['/listings/nope'] }
        )

        expect(await screen.findByText('Active listings')).toBeInTheDocument()
    })

    it('loads listings for the active status tab', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Listings: [
                    {
                        Id: 'l1',
                        WhenCreated: new Date().toISOString(),
                        WhenUpdated: new Date().toISOString(),
                        Name: 'Cool Widget',
                        ListingNumber: '123456',
                        Price: 15,
                        Status: 0,
                        StatusName: 'Active',
                        EndDate: '2024-12-01',
                        RelistedTimes: 0,
                        Quantity: 1,
                        OriginalQuantity: 1,
                    },
                ],
                Items: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route
                    path="/listings/:status"
                    element={<ListingsListPage />}
                />
            </Routes>,
            { initialEntries: ['/listings/active'] }
        )

        await waitFor(() => {
            expect(list).toHaveBeenCalledWith('active')
        })
        expect(await screen.findByText('Cool Widget')).toBeInTheDocument()
        expect(screen.getByText('123456')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view/i })).toHaveAttribute(
            'href',
            '/listings/view/l1'
        )
    })
})
