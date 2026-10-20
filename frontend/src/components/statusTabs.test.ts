import { describe, expect, it } from 'vitest'
import { LISTING_STATUS_TABS } from './listingStatus'
import { ORDER_STATUS_TABS } from './orderStatus'
import { PURCHASE_STATUS_TABS } from './purchaseStatus'
import { RETURN_STATUS_TABS } from './returnStatus'

describe('status tab route slugs', () => {
    it('keeps purchase list tabs stable', () => {
        expect(PURCHASE_STATUS_TABS.map((t) => t.slug)).toEqual([
            'ordered',
            'received',
            'inventoried',
            'completed',
            'rejected',
        ])
    })

    it('keeps order list tabs stable', () => {
        expect(ORDER_STATUS_TABS.map((t) => t.slug)).toEqual([
            'awaiting-payment',
            'awaiting-dispatch',
            'recently-dispatched',
            'dispatched',
            'cancelled',
            'returned',
        ])
    })

    it('keeps listing and return tabs stable', () => {
        expect(LISTING_STATUS_TABS.map((t) => t.slug)).toEqual([
            'active',
            'sold',
            'unsold',
            'expired',
        ])
        expect(RETURN_STATUS_TABS.map((t) => t.slug)).toEqual([
            'opened',
            'started',
            'posted',
            'received',
            'refunded',
            'closed',
            'expired',
        ])
    })
})
