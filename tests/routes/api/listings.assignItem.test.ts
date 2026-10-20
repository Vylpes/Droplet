import { Request, NextFunction } from "express";
import { ItemStatus } from "../../../src/constants/Status/ItemStatus";
import { Item } from "../../../src/database/entities/Item";
import { Listing } from "../../../src/database/entities/Listing";
import AssignItem from "../../../src/routes/api/listings/assignItem";
import { createMockRes } from "../../helpers/createMockRes";

describe("API listings assignItem", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns 400 when itemId is missing", async () => {
        const assign = new AssignItem();
        const req = {
            params: { Id: "l1" },
            body: {}
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await assign.OnPostAsync(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res.body.IsSuccess).toBe(false);
    });

    it("adds the item to the listing and marks it listed", async () => {
        const assign = new AssignItem();
        const listing = new Listing("Widget", "L-1", 10, new Date(), 3);
        listing.Items = [];
        const item = new Item("Widget", 5);

        jest.spyOn(Item, "FetchOneById").mockResolvedValue(item);
        jest.spyOn(Listing, "FetchOneById").mockResolvedValue(listing);
        jest.spyOn(listing, "Save").mockResolvedValue(undefined);
        jest.spyOn(item, "Save").mockResolvedValue(undefined);

        const req = {
            params: { Id: listing.Id },
            body: { itemId: item.Id }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await assign.OnPostAsync(req, res, next);

        expect(listing.Items).toContain(item);
        expect(item.UnlistedQuantity).toBe(2); // 5 - listing.Quantity(3)
        expect(item.ListedQuantity).toBe(3);
        expect(item.Status).toBe(ItemStatus.Unlisted); // still has unlisted stock
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Item assigned");
    });
});
