import { ListingStatus } from "../../../src/constants/Status/ListingStatus";
import { Item } from "../../../src/database/entities/Item";
import { Listing } from "../../../src/database/entities/Listing";
import PostagePolicy from "../../../src/database/entities/PostagePolicy";

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const name = "Test Listing";
        const listingNumber = "12345";
        const price = 10.99;
        const endDate = new Date();
        const quantity = 5;

        const listing = new Listing(name, listingNumber, price, endDate, quantity);

        expect(listing.Name).toBe(name);
        expect(listing.ListingNumber).toBe(listingNumber);
        expect(listing.Price).toBe(price);
        expect(listing.Status).toBe(ListingStatus.Active);
        expect(listing.EndDate).toBe(endDate);
        expect(listing.RelistedTimes).toBe(0);
        expect(listing.Quantity).toBe(quantity);
        expect(listing.OriginalQuantity).toBe(quantity);
    });
});

describe("StatusName", () => {
    test("EXPECT status friendly name to be returned", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);
        listing.Status = ListingStatus.Active;

        const statusName = listing.StatusName();

        expect(statusName).toBe("Active");
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        const newName = "Updated Listing";
        const newListingNumber = "54321";
        const newPrice = 15.99;
        const newQuantity = 3;

        listing.UpdateBasicDetails(newName, newListingNumber, newPrice, newQuantity);

        expect(listing.Name).toBe(newName);
        expect(listing.ListingNumber).toBe(newListingNumber);
        expect(listing.Price).toBe(newPrice);
        expect(listing.Quantity).toBe(newQuantity);
        expect(listing.OriginalQuantity).toBe(newQuantity);
    });
});

describe("MarkAsSold", () => {
    test("EXPECT properties to be updated", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        const amount = 2;

        listing.MarkAsSold(amount);

        expect(listing.Quantity).toBe(3);
        expect(listing.Status).toBe(ListingStatus.Active);
    });

    test("GIVEN amount parameter is more than quantity available, EXPECT nothing to happen", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        const amount = 10;

        listing.MarkAsSold(amount);

        expect(listing.Quantity).toBe(5);
        expect(listing.Status).toBe(ListingStatus.Active);
    });

    test("GIVEN the remaining quantity is 0, EXPECT status to be updated", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        const amount = 5;

        listing.MarkAsSold(amount);

        expect(listing.Quantity).toBe(0);
        expect(listing.Status).toBe(ListingStatus.Sold);
    });
});

describe("MarkAsUnsold", () => {
    test("EXPECT properties to be updated", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        listing.MarkAsUnsold();

        expect(listing.Status).toBe(ListingStatus.Unsold);
        expect(listing.Quantity).toBe(5);
    });
});

describe("RenewListing", () => {
    test("EXPECT properties to be updated", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        const newEndDate = new Date();

        listing.RenewListing(newEndDate);

        expect(listing.EndDate).toBe(newEndDate);
        expect(listing.RelistedTimes).toBe(1);
    });
});

describe("AddItemToListing", () => {
    test("EXPECT item to be pushed", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);
        listing.Items = [];

        const item = new Item("item", 1);

        listing.AddItemToListing(item);

        expect(listing.Items).toContain(item);
    });
});

describe("AddPostagePolicyToListing", () => {
    test("EXPECT entity to be assigned", () => {
        const listing = new Listing("Test Listing", "12345", 10.99, new Date(), 5);

        const policy = new PostagePolicy("Test Policy", 1, 1);

        listing.AddPostagePolicyToListing(policy);

        expect(listing.PostagePolicy).toBe(policy);
    });
});