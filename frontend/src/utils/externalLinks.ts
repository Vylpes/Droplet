export function ebayListingUrl(listingNumber: string) {
    return `https://ebay.co.uk/itm/${listingNumber}`
}

export function ebayOrderUrl(orderNumber: string) {
    return `https://www.ebay.co.uk/sh/ord/details?orderid=${orderNumber}`
}

export function ebayBuyerUrl(buyer: string) {
    return `https://www.ebay.co.uk/usr/${buyer}`
}

export function ebayReturnUrl(returnNumber: string) {
    return `https://www.ebay.co.uk/rt/ReturnDetails?returnId=${returnNumber}`
}

export function trackingUrl(service: number, number: string) {
    if (service === 0) {
        return `https://www.royalmail.com/track-your-item#/tracking-results/${number}`
    }
    if (service === 1) {
        return `https://www.myhermes.co.uk/track#/parcel/${number}`
    }
    return undefined
}

export function trackingServiceName(service: number) {
    if (service === 0) return 'Royal Mail'
    if (service === 1) return 'Hermes'
    return String(service)
}
