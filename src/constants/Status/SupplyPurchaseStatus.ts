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

export const SupplyPurchaseStatusParse = new Map<string, SupplyPurchaseStatus>([
    [ "ordered", SupplyPurchaseStatus.Ordered ],
    [ "received", SupplyPurchaseStatus.Received ],
    [ "inventoried", SupplyPurchaseStatus.Inventoried ],
    [ "complete", SupplyPurchaseStatus.Complete ],
    [ "rejected", SupplyPurchaseStatus.Rejected ],
]);