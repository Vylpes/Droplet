import { ListingStatus } from "../../src/constants/Status/ListingStatus";
import { Listing } from "../../src/database/entities/Listing";

describe("Listing domain methods", () => {
    it("MarkAsSold decreases quantity and marks sold when depleted", () => {
        const listing = new Listing("Widget", "L-1", 10, new Date(), 2);

        listing.MarkAsSold(1);
        expect(listing.Quantity).toBe(1);
        expect(listing.Status).toBe(ListingStatus.Active);

        listing.MarkAsSold(1);
        expect(listing.Quantity).toBe(0);
        expect(listing.Status).toBe(ListingStatus.Sold);
    });

    it("MarkAsSold ignores amounts greater than remaining quantity", () => {
        const listing = new Listing("Widget", "L-1", 10, new Date(), 1);

        listing.MarkAsSold(5);

        expect(listing.Quantity).toBe(1);
        expect(listing.Status).toBe(ListingStatus.Active);
    });

    it("MarkAsUnsold restores original quantity", () => {
        const listing = new Listing("Widget", "L-1", 10, new Date(), 3);
        listing.MarkAsSold(2);

        listing.MarkAsUnsold();

        expect(listing.Status).toBe(ListingStatus.Unsold);
        expect(listing.Quantity).toBe(3);
    });

    it("RenewListing bumps end date and relist counter", () => {
        const listing = new Listing("Widget", "L-1", 10, new Date("2024-01-01"), 1);
        const nextEnd = new Date("2024-02-01");

        listing.RenewListing(nextEnd);

        expect(listing.EndDate).toBe(nextEnd);
        expect(listing.RelistedTimes).toBe(1);
    });
});
