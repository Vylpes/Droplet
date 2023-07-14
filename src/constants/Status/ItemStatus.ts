export enum ItemStatus {
    Unlisted,
    Listed,
    Sold,
    Rejected,
}

export const ItemStatusNames = new Map<ItemStatus, string>([
    [ ItemStatus.Unlisted, "Unlisted" ],
    [ ItemStatus.Listed, "Listed" ],
    [ ItemStatus.Sold, "Sold" ],
    [ ItemStatus.Rejected, "Rejected" ],
]);