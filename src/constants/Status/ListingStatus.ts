export enum ListingStatus {
    Active,
    Sold,
    Unsold
}

export const ListingStatusNames = new Map<ListingStatus, string>([
    [ ListingStatus.Active, "Active" ],
    [ ListingStatus.Sold, "Sold" ],
    [ ListingStatus.Unsold, "Unsold" ],
]);

export const ListingStatusTypes = new Map<string, ListingStatus>([
    [ "active", ListingStatus.Active ],
    [ "sold", ListingStatus.Sold ],
    [ "unsold", ListingStatus.Unsold ],
]);