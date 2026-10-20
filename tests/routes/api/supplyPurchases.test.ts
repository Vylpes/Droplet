import { Request, NextFunction } from "express";
import { SupplyPurchaseStatus } from "../../../src/constants/Status/SupplyPurchaseStatus";
import { SupplyPurchase } from "../../../src/database/entities/SupplyPurchase";
import List from "../../../src/routes/api/supplyPurchases/list";
import UpdateStatus from "../../../src/routes/api/supplyPurchases/updateStatus";
import { createMockRes } from "../../helpers/createMockRes";

describe("API supply purchases", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("List", () => {
        it("filters purchases by status slug", async () => {
            const list = new List();
            const ordered = new SupplyPurchase("Tape", 5);
            const received = new SupplyPurchase("Boxes", 8);
            received.Status = SupplyPurchaseStatus.Received;

            jest.spyOn(SupplyPurchase, "FetchAll").mockResolvedValue([
                ordered,
                received
            ]);

            const req = { params: { status: "received" } } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            await list.OnGetAsync(req, res, next);

            expect(res.body.Data).toHaveLength(1);
            expect(res.body.Data[0].Description).toBe("Boxes");
        });
    });

    describe("UpdateStatus", () => {
        it("updates status and returns mapped purchase", async () => {
            const updateStatus = new UpdateStatus();
            const purchase = new SupplyPurchase("Tape", 5);

            jest.spyOn(SupplyPurchase, "FetchOneById").mockResolvedValue(purchase);
            jest.spyOn(purchase, "Save").mockResolvedValue(undefined);

            const req = {
                params: { Id: purchase.Id },
                body: { status: SupplyPurchaseStatus.Inventoried }
            } as unknown as Request;
            const res = createMockRes();
            const next = jest.fn() as NextFunction;

            await updateStatus.OnPostAsync(req, res, next);

            expect(purchase.Status).toBe(SupplyPurchaseStatus.Inventoried);
            expect(res.body.IsSuccess).toBe(true);
            expect(res.body.Message).toBe("Status updated");
        });
    });
});
