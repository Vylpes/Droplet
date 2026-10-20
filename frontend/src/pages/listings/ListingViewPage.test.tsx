import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ListingViewPage } from './ListingViewPage'

const get = vi.fn()

vi.mock('../../api/client', () => ({
    listingsApi: {
        get: (...args: unknown[]) => get(...args),
        update: vi.fn(),
        end: vi.fn(),
        renew: vi.fn(),
        assignItem: vi.fn(),
        assignPostagePolicy: vi.fn(),
        addNote: vi.fn(),
    },
}))

describe('ListingViewPage', () => {
    beforeEach(() => {
        get.mockReset()
    })

    it('shows loading then listing details', async () => {
        get.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Listing: {
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
                    Items: [],
                },
                Items: [],
                PostagePolicies: [],
                Notes: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route
                    path="/listings/view/:Id"
                    element={<ListingViewPage />}
                />
            </Routes>,
            { initialEntries: ['/listings/view/l1'] }
        )

        expect(screen.getByText('Loading…')).toBeInTheDocument()

        await waitFor(() => {
            expect(get).toHaveBeenCalledWith('l1')
        })
        expect(
            await screen.findByRole('heading', { name: 'Cool Widget' })
        ).toBeInTheDocument()
        expect(screen.getByText('123456')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /back to list/i })
        ).toHaveAttribute('href', '/listings/active')
    })

    it('shows an error when the listing fails to load', async () => {
        get.mockRejectedValue(new Error('Not found'))

        renderWithProviders(
            <Routes>
                <Route
                    path="/listings/view/:Id"
                    element={<ListingViewPage />}
                />
            </Routes>,
            { initialEntries: ['/listings/view/missing'] }
        )

        expect(await screen.findByText('Not found')).toBeInTheDocument()
    })
})
