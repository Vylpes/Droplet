import type { StatusTab } from './purchaseStatus'

export const LISTING_STATUS_TABS: StatusTab[] = [
    { slug: 'active', label: 'Active' },
    { slug: 'sold', label: 'Sold' },
    { slug: 'unsold', label: 'Unsold' },
    { slug: 'expired', label: 'Expired' },
]
