import { describe, expect, it } from 'vitest'
import {
    calculateEbayFees,
    FIXED_FEE,
    formatMoney,
    VAT,
} from './feesCalculator'

describe('calculateEbayFees', () => {
    it('computes fees with VAT and the fixed fee', () => {
        const result = calculateEbayFees({
            itemBuyPrice: 10,
            itemSellPrice: 20,
            shippingCostToBuyer: 5,
            actualShippingCost: 3,
            feesRatePercent: 10,
        })

        // (20 + 5) * 0.10 * 1.2 + 0.30 = 3.30
        expect(result.totalFees).toBeCloseTo(3.3)
        // 20 + 5 - (10 + 3 + 3.3) = 8.7
        expect(result.profit).toBeCloseTo(8.7)
    })

    it('applies the fixed fee even when the sell price is zero', () => {
        const result = calculateEbayFees({
            itemBuyPrice: 0,
            itemSellPrice: 0,
            shippingCostToBuyer: 0,
            actualShippingCost: 0,
            feesRatePercent: 12.9,
        })

        expect(result.totalFees).toBe(FIXED_FEE)
        expect(result.profit).toBe(-FIXED_FEE)
    })

    it('exports the VAT multiplier used by the calculator', () => {
        expect(VAT).toBe(1.2)
    })
})

describe('formatMoney', () => {
    it('formats to two decimal places', () => {
        expect(formatMoney(8.7)).toBe('8.70')
        expect(formatMoney(3)).toBe('3.00')
    })
})
