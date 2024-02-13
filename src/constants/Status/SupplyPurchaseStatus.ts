export enum SupplyPurchaseStatus {
    Ordered,
    Received,
    Inventoried,
    Complete,
    Rejected,
}

export const SupplyPurchaseStatusNames = new Map<SupplyPurchaseStatus, string>([
    [ SupplyPurchaseStatus.Ordered, "Ordered" ],
    [ SupplyPurchaseStatus.Received, "Received" ],
    [ SupplyPurchaseStatus.Inventoried, "Inventoried" ],
    [ SupplyPurchaseStatus.Complete, "Complete" ],
    [ SupplyPurchaseStatus.Rejected, "Rejected" ],
]);