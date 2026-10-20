import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/render'
import { ItemPurchasesListPage } from './ItemPurchasesListPage'

const list = vi.fn()

vi.mock('../../api/client', () => ({
    itemPurchasesApi: {
        list: (...args: unknown[]) => list(...args),
        create: vi.fn(),
    },
}))

describe('ItemPurchasesListPage', () => {
    beforeEach(() => {
        list.mockReset()
    })

    it('redirects invalid status slugs to ordered', async () => {
        list.mockResolvedValue({ IsSuccess: true, Data: [] })

        renderWithProviders(
            <Routes>
                <Route
                    path="/item-purchases/:status"
                    element={<ItemPurchasesListPage />}
                />
                <Route
                    path="/item-purchases/ordered"
                    element={<div>Ordered list</div>}
                />
            </Routes>,
            { initialEntries: ['/item-purchases/not-a-status'] }
        )

        expect(await screen.findByText('Ordered list')).toBeInTheDocument()
    })

    it('loads purchases for the active status tab', async () => {
        list.mockResolvedValue({
            IsSuccess: true,
            Data: [
                {
                    Id: 'p1',
                    WhenCreated: new Date().toISOString(),
                    WhenUpdated: new Date().toISOString(),
                    Description: 'Bulk widgets',
                    Status: 0,
                    StatusName: 'Ordered',
                    Price: 12.5,
                    Items: [],
                },
            ],
        })

        renderWithProviders(
            <Routes>
                <Route
                    path="/item-purchases/:status"
                    element={<ItemPurchasesListPage />}
                />
            </Routes>,
            { initialEntries: ['/item-purchases/ordered'] }
        )

        expect(screen.getByText('Loading…')).toBeInTheDocument()

        await waitFor(() => {
            expect(list).toHaveBeenCalledWith('ordered')
        })
        expect(await screen.findByText('Bulk widgets')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view/i })).toHaveAttribute(
            'href',
            '/item-purchases/view/p1'
        )
    })
})
