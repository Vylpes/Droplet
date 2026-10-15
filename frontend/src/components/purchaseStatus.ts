export interface StatusTab {
    slug: string
    label: string
}

export const PURCHASE_STATUS_TABS: StatusTab[] = [
    { slug: 'ordered', label: 'Ordered' },
    { slug: 'received', label: 'Received' },
    { slug: 'inventoried', label: 'Inventoried' },
    { slug: 'completed', label: 'Completed' },
    { slug: 'rejected', label: 'Rejected' },
]

/** Suggest next status in the Update Status modal (matches Pug select defaults). */
export function suggestedPurchaseStatus(current: number): number {
    if (current === 0) return 1
    if (current === 1) return 2
    if (current === 2 || current === 3) return 3
    if (current === 4) return 4
    return current
}
