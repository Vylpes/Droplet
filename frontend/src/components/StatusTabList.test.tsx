import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../test/render'
import { StatusTabList } from './StatusTabList'

const tabs = [
    { slug: 'ordered', label: 'Ordered' },
    { slug: 'received', label: 'Received' },
]

describe('StatusTabList', () => {
    it('renders the title, active tab, and children', () => {
        renderWithProviders(
            <StatusTabList
                title="Item Purchases"
                basePath="/item-purchases"
                activeStatus="ordered"
                tabs={tabs}
            >
                <p>Table body</p>
            </StatusTabList>
        )

        expect(
            screen.getByRole('heading', { name: 'Item Purchases' })
        ).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Ordered' })).toHaveAttribute(
            'href',
            '/item-purchases/ordered'
        )
        expect(screen.getByRole('link', { name: 'Received' })).toHaveAttribute(
            'href',
            '/item-purchases/received'
        )
        expect(screen.getByText('Table body')).toBeInTheDocument()
    })

    it('shows a New button when onNew is provided', async () => {
        const user = userEvent.setup()
        const onNew = vi.fn()

        renderWithProviders(
            <StatusTabList
                title="Orders"
                basePath="/orders"
                activeStatus="paid"
                tabs={[{ slug: 'paid', label: 'Paid' }]}
                onNew={onNew}
                newLabel="New Order"
            >
                <div />
            </StatusTabList>
        )

        await user.click(screen.getByRole('button', { name: /new order/i }))
        expect(onNew).toHaveBeenCalledOnce()
    })

    it('hides the New button when onNew is omitted', () => {
        renderWithProviders(
            <StatusTabList
                title="Orders"
                basePath="/orders"
                activeStatus="paid"
                tabs={[{ slug: 'paid', label: 'Paid' }]}
            >
                <div />
            </StatusTabList>
        )

        expect(screen.queryByRole('button', { name: /new/i })).toBeNull()
    })
})
