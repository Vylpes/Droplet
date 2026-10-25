/** Client-side eBay fees calculator (ported from public/js/dashboard/calculator.js). */

export const VAT = 1.2
export const FIXED_FEE = 0.3

export interface FeesCalculatorInput {
    itemBuyPrice: number
    itemSellPrice: number
    shippingCostToBuyer: number
    actualShippingCost: number
    /** Fee rate as a percentage (e.g. 10 for 10%). */
    feesRatePercent: number
}

export interface FeesCalculatorResult {
    totalFees: number
    profit: number
}

export function calculateEbayFees(
    input: FeesCalculatorInput
): FeesCalculatorResult {
    const feesRate = input.feesRatePercent / 100
    const totalFees =
        (input.itemSellPrice + input.shippingCostToBuyer) * feesRate * VAT +
        FIXED_FEE
    const profit =
        input.itemSellPrice +
        input.shippingCostToBuyer -
        (input.itemBuyPrice + input.actualShippingCost + totalFees)

    return { totalFees, profit }
}

export function formatMoney(value: number): string {
    return value.toFixed(2)
}
