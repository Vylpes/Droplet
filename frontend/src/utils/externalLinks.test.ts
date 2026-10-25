import { describe, expect, it } from 'vitest'
import {
    ebayBuyerUrl,
    ebayListingUrl,
    ebayOrderUrl,
    ebayReturnUrl,
    trackingServiceName,
    trackingUrl,
} from './externalLinks'

describe('externalLinks', () => {
    it('builds eBay URLs', () => {
        expect(ebayListingUrl('123')).toBe('https://ebay.co.uk/itm/123')
        expect(ebayOrderUrl('ORD-1')).toBe(
            'https://www.ebay.co.uk/sh/ord/details?orderid=ORD-1'
        )
        expect(ebayBuyerUrl('alice')).toBe('https://www.ebay.co.uk/usr/alice')
        expect(ebayReturnUrl('R-9')).toBe(
            'https://www.ebay.co.uk/rt/ReturnDetails?returnId=R-9'
        )
    })

    it('builds known tracking URLs and labels', () => {
        expect(trackingUrl(0, 'AA1')).toContain('royalmail.com')
        expect(trackingUrl(0, 'AA1')).toContain('AA1')
        expect(trackingUrl(1, 'BB2')).toContain('myhermes.co.uk')
        expect(trackingUrl(99, 'XX')).toBeUndefined()

        expect(trackingServiceName(0)).toBe('Royal Mail')
        expect(trackingServiceName(1)).toBe('Hermes')
        expect(trackingServiceName(7)).toBe('7')
    })
})
