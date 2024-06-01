import { Request, Response } from "express";
import List from "../../../src/routes/itemPurchases/list";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";
import { ItemPurchaseStatus } from "../../../src/constants/Status/ItemPurchaseStatus";
import createHttpError from "http-errors";

describe("OnGetAsync", () => {
    test("GIVEN status parameter is ordered, EXPECT item purchases to be listed with status ordered", async () => {
        // Arrange
        const req = {
            params: {
                status: "ordered",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        ItemPurchase.FetchAll = jest.fn().mockResolvedValue([
            {
                Id: "orderedPurchaseId",
                Status: ItemPurchaseStatus.Ordered,
            } as ItemPurchase,
            {
                Id: "receivedPurchaseId",
                Status: ItemPurchaseStatus.Received,
            } as ItemPurchase,
            {
                Id: "inventoriedPurchaseId",
                Status: ItemPurchaseStatus.Inventoried,
            } as ItemPurchase,
            {
                Id: "completePurchaseId",
                Status: ItemPurchaseStatus.Complete,
            } as ItemPurchase,
            {
                Id: "rejectedPurchaseId",
                Status: ItemPurchaseStatus.Rejected,
            } as ItemPurchase,
        ])

        // Act
        const page = new List();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("item-purchases/list/ordered", res.locals.viewData);

        expect(res.locals.purchases).toBeDefined();
        expect(res.locals.purchases.length).toBe(1);

        const itemPurchase = res.locals.purchases[0] as ItemPurchase;

        expect(itemPurchase).toBeDefined();
        expect(itemPurchase.Id).toBe("orderedPurchaseId");
        expect(itemPurchase.Status).toBe(ItemPurchaseStatus.Ordered);

        expect(ItemPurchase.FetchAll).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchAll).toHaveBeenCalledWith(ItemPurchase, [ "Items" ]);
    });

    test("GIVEN status parameter is received, EXPECT item purchases to be listed with status received", async () => {
        // Arrange
        const req = {
            params: {
                status: "received",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        ItemPurchase.FetchAll = jest.fn().mockResolvedValue([
            {
                Id: "orderedPurchaseId",
                Status: ItemPurchaseStatus.Ordered,
            } as ItemPurchase,
            {
                Id: "receivedPurchaseId",
                Status: ItemPurchaseStatus.Received,
            } as ItemPurchase,
            {
                Id: "inventoriedPurchaseId",
                Status: ItemPurchaseStatus.Inventoried,
            } as ItemPurchase,
            {
                Id: "completePurchaseId",
                Status: ItemPurchaseStatus.Complete,
            } as ItemPurchase,
            {
                Id: "rejectedPurchaseId",
                Status: ItemPurchaseStatus.Rejected,
            } as ItemPurchase,
        ])

        // Act
        const page = new List();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("item-purchases/list/received", res.locals.viewData);

        expect(res.locals.purchases).toBeDefined();
        expect(res.locals.purchases.length).toBe(1);

        const itemPurchase = res.locals.purchases[0] as ItemPurchase;

        expect(itemPurchase).toBeDefined();
        expect(itemPurchase.Id).toBe("receivedPurchaseId");
        expect(itemPurchase.Status).toBe(ItemPurchaseStatus.Received);

        expect(ItemPurchase.FetchAll).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchAll).toHaveBeenCalledWith(ItemPurchase, [ "Items" ]);
    });

    test("GIVEN status parameter is inventoried, EXPECT item purchases to be listed with status inventoried", async () => {
        // Arrange
        const req = {
            params: {
                status: "inventoried",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        ItemPurchase.FetchAll = jest.fn().mockResolvedValue([
            {
                Id: "orderedPurchaseId",
                Status: ItemPurchaseStatus.Ordered,
            } as ItemPurchase,
            {
                Id: "receivedPurchaseId",
                Status: ItemPurchaseStatus.Received,
            } as ItemPurchase,
            {
                Id: "inventoriedPurchaseId",
                Status: ItemPurchaseStatus.Inventoried,
            } as ItemPurchase,
            {
                Id: "completePurchaseId",
                Status: ItemPurchaseStatus.Complete,
            } as ItemPurchase,
            {
                Id: "rejectedPurchaseId",
                Status: ItemPurchaseStatus.Rejected,
            } as ItemPurchase,
        ])

        // Act
        const page = new List();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("item-purchases/list/inventoried", res.locals.viewData);

        expect(res.locals.purchases).toBeDefined();
        expect(res.locals.purchases.length).toBe(1);

        const itemPurchase = res.locals.purchases[0] as ItemPurchase;

        expect(itemPurchase).toBeDefined();
        expect(itemPurchase.Id).toBe("inventoriedPurchaseId");
        expect(itemPurchase.Status).toBe(ItemPurchaseStatus.Inventoried);

        expect(ItemPurchase.FetchAll).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchAll).toHaveBeenCalledWith(ItemPurchase, [ "Items" ]);
    });

    test("GIVEN status parameter is completed, EXPECT item purchases to be listed with status completed", async () => {
        // Arrange
        const req = {
            params: {
                status: "completed",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        ItemPurchase.FetchAll = jest.fn().mockResolvedValue([
            {
                Id: "orderedPurchaseId",
                Status: ItemPurchaseStatus.Ordered,
            } as ItemPurchase,
            {
                Id: "receivedPurchaseId",
                Status: ItemPurchaseStatus.Received,
            } as ItemPurchase,
            {
                Id: "inventoriedPurchaseId",
                Status: ItemPurchaseStatus.Inventoried,
            } as ItemPurchase,
            {
                Id: "completePurchaseId",
                Status: ItemPurchaseStatus.Complete,
            } as ItemPurchase,
            {
                Id: "rejectedPurchaseId",
                Status: ItemPurchaseStatus.Rejected,
            } as ItemPurchase,
        ])

        // Act
        const page = new List();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("item-purchases/list/completed", res.locals.viewData);

        expect(res.locals.purchases).toBeDefined();
        expect(res.locals.purchases.length).toBe(1);

        const itemPurchase = res.locals.purchases[0] as ItemPurchase;

        expect(itemPurchase).toBeDefined();
        expect(itemPurchase.Id).toBe("completePurchaseId");
        expect(itemPurchase.Status).toBe(ItemPurchaseStatus.Complete);

        expect(ItemPurchase.FetchAll).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchAll).toHaveBeenCalledWith(ItemPurchase, [ "Items" ]);
    });

    test("GIVEN status parameter is rejected, EXPECT item purchases to be listed with status rejected", async () => {
        // Arrange
        const req = {
            params: {
                status: "rejected",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        ItemPurchase.FetchAll = jest.fn().mockResolvedValue([
            {
                Id: "orderedPurchaseId",
                Status: ItemPurchaseStatus.Ordered,
            } as ItemPurchase,
            {
                Id: "receivedPurchaseId",
                Status: ItemPurchaseStatus.Received,
            } as ItemPurchase,
            {
                Id: "inventoriedPurchaseId",
                Status: ItemPurchaseStatus.Inventoried,
            } as ItemPurchase,
            {
                Id: "completePurchaseId",
                Status: ItemPurchaseStatus.Complete,
            } as ItemPurchase,
            {
                Id: "rejectedPurchaseId",
                Status: ItemPurchaseStatus.Rejected,
            } as ItemPurchase,
        ])

        // Act
        const page = new List();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith("item-purchases/list/rejected", res.locals.viewData);

        expect(res.locals.purchases).toBeDefined();
        expect(res.locals.purchases.length).toBe(1);

        const itemPurchase = res.locals.purchases[0] as ItemPurchase;

        expect(itemPurchase).toBeDefined();
        expect(itemPurchase.Id).toBe("rejectedPurchaseId");
        expect(itemPurchase.Status).toBe(ItemPurchaseStatus.Rejected);

        expect(ItemPurchase.FetchAll).toHaveBeenCalledTimes(1);
        expect(ItemPurchase.FetchAll).toHaveBeenCalledWith(ItemPurchase, [ "Items" ]);
    });

    test("GIVEN status parameter is invalid, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                status: "other",
            }
        } as unknown as Request;

        const res = {
            render: jest.fn(),
            locals: {},
        } as unknown as Response;

        const next = jest.fn();

        ItemPurchase.FetchAll = jest.fn().mockResolvedValue([
            {
                Id: "orderedPurchaseId",
                Status: ItemPurchaseStatus.Ordered,
            } as ItemPurchase,
            {
                Id: "receivedPurchaseId",
                Status: ItemPurchaseStatus.Received,
            } as ItemPurchase,
            {
                Id: "inventoriedPurchaseId",
                Status: ItemPurchaseStatus.Inventoried,
            } as ItemPurchase,
            {
                Id: "completePurchaseId",
                Status: ItemPurchaseStatus.Complete,
            } as ItemPurchase,
            {
                Id: "rejectedPurchaseId",
                Status: ItemPurchaseStatus.Rejected,
            } as ItemPurchase,
        ])

        // Act
        const page = new List();
        await page.OnGetAsync(req, res, next);

        // Assert
        expect(res.locals.purchases).toBeUndefined();

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));
    });
});