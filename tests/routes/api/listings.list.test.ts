import { Request, NextFunction } from "express";
import { ListingStatus } from "../../../src/constants/Status/ListingStatus";
import { Item } from "../../../src/database/entities/Item";
import { Listing } from "../../../src/database/entities/Listing";
import List from "../../../src/routes/api/listings/list";
import { createMockRes } from "../../helpers/createMockRes";

describe("API listings list", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("filters active listings and returns unlisted items for create UI", async () => {
        const list = new List();
        const active = new Listing("Active", "L-1", 10, new Date(), 1);
        const sold = new Listing("Sold", "L-2", 10, new Date(), 1);
        sold.Status = ListingStatus.Sold;
        const unlistedItem = new Item("Spare", 2);

        jest.spyOn(Listing, "FetchAll").mockResolvedValue([active, sold]);
        jest.spyOn(Item, "FetchAll").mockResolvedValue([unlistedItem]);

        const req = { params: { status: "active" } } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await list.OnGetAsync(req, res, next);

        expect(res.body.Data.Listings).toHaveLength(1);
        expect(res.body.Data.Listings[0].Name).toBe("Active");
        expect(res.body.Data.Items).toHaveLength(1);
        expect(res.body.Data.Items[0].Name).toBe("Spare");
    });

    it("filters expired active listings by EndDate", async () => {
        const list = new List();
        const expired = new Listing("Old", "L-old", 10, new Date("2020-01-01"), 1);
        const future = new Listing("New", "L-new", 10, new Date("2099-01-01"), 1);

        jest.spyOn(Listing, "FetchAll").mockResolvedValue([expired, future]);
        jest.spyOn(Item, "FetchAll").mockResolvedValue([]);

        const req = { params: { status: "expired" } } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await list.OnGetAsync(req, res, next);

        expect(res.body.Data.Listings).toHaveLength(1);
        expect(res.body.Data.Listings[0].Name).toBe("Old");
    });
});
