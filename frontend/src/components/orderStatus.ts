import type { StatusTab } from './purchaseStatus'

export const ORDER_STATUS_TABS: StatusTab[] = [
    { slug: 'awaiting-payment', label: 'Awaiting Payment' },
    { slug: 'awaiting-dispatch', label: 'Awaiting Dispatch' },
    { slug: 'recently-dispatched', label: 'Recently Dispatched' },
    { slug: 'dispatched', label: 'Dispatched' },
    { slug: 'cancelled', label: 'Cancelled' },
    { slug: 'returned', label: 'Returned' },
]
