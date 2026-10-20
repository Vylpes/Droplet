import { Request, NextFunction } from "express";
import { OrderStatus } from "../../../src/constants/Status/OrderStatus";
import { Listing } from "../../../src/database/entities/Listing";
import { Order } from "../../../src/database/entities/Order";
import PostagePolicy from "../../../src/database/entities/PostagePolicy";
import List from "../../../src/routes/api/orders/list";
import { createMockRes } from "../../helpers/createMockRes";

describe("API orders list", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("filters awaiting-payment orders and includes related catalogs", async () => {
        const list = new List();
        const awaiting = new Order("ORD-1", false, "buyer");
        const paid = new Order("ORD-2", true, "buyer");
        paid.Status = OrderStatus.AwaitingDispatch;

        jest.spyOn(Order, "FetchAll").mockResolvedValue([awaiting, paid]);
        jest.spyOn(Listing, "FetchAll").mockResolvedValue([]);
        jest.spyOn(PostagePolicy, "FetchAll").mockResolvedValue([]);

        const req = {
            params: { status: "awaiting-payment" }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await list.OnGetAsync(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.body.Data.Orders).toHaveLength(1);
        expect(res.body.Data.Orders[0].OrderNumber).toBe("ORD-1");
        expect(res.body.Data.Listings).toEqual([]);
        expect(res.body.Data.PostagePolicies).toEqual([]);
    });

    it("only includes recently dispatched orders within the 32h window", async () => {
        const list = new List();
        const recent = new Order("ORD-recent", true, "buyer");
        recent.Status = OrderStatus.Dispatched;
        recent.DispatchBy = new Date();

        const old = new Order("ORD-old", true, "buyer");
        old.Status = OrderStatus.Dispatched;
        old.DispatchBy = new Date(Date.now() - 1000 * 60 * 60 * 40);

        jest.spyOn(Order, "FetchAll").mockResolvedValue([recent, old]);
        jest.spyOn(Listing, "FetchAll").mockResolvedValue([]);
        jest.spyOn(PostagePolicy, "FetchAll").mockResolvedValue([]);

        const req = {
            params: { status: "recently-dispatched" }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await list.OnGetAsync(req, res, next);

        expect(res.body.Data.Orders).toHaveLength(1);
        expect(res.body.Data.Orders[0].OrderNumber).toBe("ORD-recent");
    });
});
