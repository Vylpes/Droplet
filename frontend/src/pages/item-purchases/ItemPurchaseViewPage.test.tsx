import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ItemPurchaseViewPage } from './ItemPurchaseViewPage'

const get = vi.fn()

vi.mock('../../api/client', () => ({
    itemPurchasesApi: {
        get: (...args: unknown[]) => get(...args),
        update: vi.fn(),
        updateStatus: vi.fn(),
        addNote: vi.fn(),
    },
    itemsApi: {
        create: vi.fn(),
    },
}))

describe('ItemPurchaseViewPage', () => {
    beforeEach(() => {
        get.mockReset()
    })

    it('shows loading then purchase details', async () => {
        get.mockResolvedValue({
            IsSuccess: true,
            Data: {
                Purchase: {
                    Id: 'p1',
                    WhenCreated: new Date().toISOString(),
                    WhenUpdated: new Date().toISOString(),
                    Description: 'Bulk widgets',
                    Status: 0,
                    StatusName: 'Ordered',
                    Price: 12.5,
                    Items: [],
                },
                Notes: [],
            },
        })

        renderWithProviders(
            <Routes>
                <Route
                    path="/item-purchases/view/:Id"
                    element={<ItemPurchaseViewPage />}
                />
            </Routes>,
            { initialEntries: ['/item-purchases/view/p1'] }
        )

        expect(screen.getByText('Loading…')).toBeInTheDocument()

        await waitFor(() => {
            expect(get).toHaveBeenCalledWith('p1')
        })
        expect(
            await screen.findByRole('heading', { name: 'Bulk widgets' })
        ).toBeInTheDocument()
        expect(screen.getByText('Ordered')).toBeInTheDocument()
        expect(
            screen.getByRole('link', { name: /back to list/i })
        ).toHaveAttribute('href', '/item-purchases/ordered')
    })

    it('shows an error when the purchase fails to load', async () => {
        get.mockRejectedValue(new Error('Not found'))

        renderWithProviders(
            <Routes>
                <Route
                    path="/item-purchases/view/:Id"
                    element={<ItemPurchaseViewPage />}
                />
            </Routes>,
            { initialEntries: ['/item-purchases/view/missing'] }
        )

        expect(await screen.findByText('Not found')).toBeInTheDocument()
    })
})
