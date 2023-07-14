export enum ItemPurchaseStatus {
    Ordered,
    Received,
    Inventoried,
    Complete,
    Rejected,
}

export const ItemPurchaseStatusNames = new Map<ItemPurchaseStatus, string>([
    [ ItemPurchaseStatus.Ordered, "Ordered" ],
    [ ItemPurchaseStatus.Received, "Received" ],
    [ ItemPurchaseStatus.Inventoried, "Inventoried" ],
    [ ItemPurchaseStatus.Complete, "Complete" ],
    [ ItemPurchaseStatus.Rejected, "Rejected" ],
]);