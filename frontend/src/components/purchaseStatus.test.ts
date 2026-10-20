import { describe, expect, it } from 'vitest'
import { suggestedPurchaseStatus } from './purchaseStatus'

describe('suggestedPurchaseStatus', () => {
    it('advances ordered → received → inventoried → completed', () => {
        expect(suggestedPurchaseStatus(0)).toBe(1)
        expect(suggestedPurchaseStatus(1)).toBe(2)
        expect(suggestedPurchaseStatus(2)).toBe(3)
        expect(suggestedPurchaseStatus(3)).toBe(3)
    })

    it('keeps rejected at rejected', () => {
        expect(suggestedPurchaseStatus(4)).toBe(4)
    })

    it('returns the current status for unknown values', () => {
        expect(suggestedPurchaseStatus(99)).toBe(99)
    })
})
