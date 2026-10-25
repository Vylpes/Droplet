import type { StatusTab } from './purchaseStatus'

export const RETURN_STATUS_TABS: StatusTab[] = [
    { slug: 'opened', label: 'Opened' },
    { slug: 'started', label: 'Started' },
    { slug: 'posted', label: 'Posted' },
    { slug: 'received', label: 'Received' },
    { slug: 'refunded', label: 'Refunded' },
    { slug: 'closed', label: 'Closed' },
    { slug: 'expired', label: 'Expired' },
]
