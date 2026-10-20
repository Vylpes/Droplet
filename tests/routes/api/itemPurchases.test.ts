import { Request, NextFunction } from "express";
import { ItemPurchaseStatus } from "../../../src/constants/Status/ItemPurchaseStatus";
import { ItemPurchase } from "../../../src/database/entities/ItemPurchase";
import List from "../../../src/routes/api/itemPurchases/list";
import UpdateStatus from "../../../src/routes/api/itemPurchases/updateStatus";
import { createMockRes } from "../../helpers/createMockRes";

describe("API item purchases", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("List", () => {
        const list = new List();

        it("filters purchases by status slug", async () => {
            const ordered = new ItemPurchase("Ordered one", 10);
            const received = new ItemPurchase("Received one", 20);
            received.Status = ItemPurchaseStatus.Received;

            jest.spyOn(ItemPurchase, "FetchAll").mockResolvedValue([
                ordered,
                received
            ]);

            const req = { params: { status: "ordered" } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            await list.OnGetAsync(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.body.IsSuccess).toBe(true);
            expect(res.body.Data).toHaveLength(1);
            expect(res.body.Data[0].Description).toBe("Ordered one");
        });

        it("forwards 404 for unknown status", async () => {
            jest.spyOn(ItemPurchase, "FetchAll").mockResolvedValue([]);

            const req = { params: { status: "nope" } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            await list.OnGetAsync(req, res, next);

            expect(next).toHaveBeenCalled();
            const err = (next as jest.Mock).mock.calls[0][0];
            expect(err.status).toBe(404);
        });
    });

    describe("UpdateStatus", () => {
        const updateStatus = new UpdateStatus();

        it("returns 400 when status is missing", async () => {
            const req = {
                params: { Id: "p1" },
                body: {}
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            await updateStatus.OnPostAsync(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(res.body.IsSuccess).toBe(false);
        });

        it("updates status and returns the mapped purchase", async () => {
            const purchase = new ItemPurchase("Widgets", 10);
            jest.spyOn(ItemPurchase, "FetchOneById").mockResolvedValue(purchase);
            jest.spyOn(purchase, "Save").mockResolvedValue(undefined);

            const req = {
                params: { Id: purchase.Id },
                body: { status: ItemPurchaseStatus.Received }
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            await updateStatus.OnPostAsync(req, res, next);

            expect(purchase.Status).toBe(ItemPurchaseStatus.Received);
            expect(purchase.Save).toHaveBeenCalled();
            expect(res.body.IsSuccess).toBe(true);
            expect(res.body.Message).toBe("Status updated");
            expect(res.body.Data.Status).toBe(ItemPurchaseStatus.Received);
        });
    });
});
