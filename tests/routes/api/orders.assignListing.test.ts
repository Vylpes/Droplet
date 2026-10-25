import { Request, NextFunction } from "express";
import { ItemStatus } from "../../../src/constants/Status/ItemStatus";
import { ListingStatus } from "../../../src/constants/Status/ListingStatus";
import { Item } from "../../../src/database/entities/Item";
import { Listing } from "../../../src/database/entities/Listing";
import { Order } from "../../../src/database/entities/Order";
import AssignListing from "../../../src/routes/api/orders/assignListing";
import { createMockRes } from "../../helpers/createMockRes";

describe("API orders assignListing", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns 400 when listingId/amount are missing", async () => {
        const assign = new AssignListing();
        const req = {
            params: { Id: "o1" },
            body: {}
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await assign.OnPostAsync(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res.body.IsSuccess).toBe(false);
    });

    it("assigns a listing, marks sold qty, and marks listing items sold", async () => {
        const assign = new AssignListing();
        const order = new Order("ORD-4", true, "buyer");
        order.Listings = [];

        const listing = new Listing("Widget", "L-9", 25, new Date(), 2);
        const item = new Item("Widget", 0);
        item.ListedQuantity = 2;
        item.Status = ItemStatus.Listed;
        listing.Items = [item];

        jest.spyOn(Listing, "FetchOneById").mockResolvedValue(listing);
        jest.spyOn(Order, "FetchOneById").mockResolvedValue(order);
        jest.spyOn(order, "Save").mockResolvedValue(undefined);
        jest.spyOn(listing, "Save").mockResolvedValue(undefined);
        jest.spyOn(item, "Save").mockResolvedValue(undefined);

        const req = {
            params: { Id: order.Id },
            body: { listingId: listing.Id, amount: 2 }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await assign.OnPostAsync(req, res, next);

        expect(order.Listings).toHaveLength(1);
        expect(order.Price).toBe(25);
        expect(listing.Quantity).toBe(0);
        expect(listing.Status).toBe(ListingStatus.Sold);
        expect(item.SoldQuantity).toBe(2);
        expect(item.Status).toBe(ItemStatus.Sold);
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Listing assigned");
    });
});
