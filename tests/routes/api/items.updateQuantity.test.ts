import { Request, NextFunction } from "express";
import { ItemStatus } from "../../../src/constants/Status/ItemStatus";
import { Item } from "../../../src/database/entities/Item";
import UpdateQuantity from "../../../src/routes/api/items/update-quantity";
import { createMockRes } from "../../helpers/createMockRes";

describe("API items update-quantity", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns 400 when quantity fields are invalid", async () => {
        const update = new UpdateQuantity();
        const req = {
            params: { itemId: "i1" },
            body: { unlisted: -1, listed: 0, sold: 0, rejected: 0 }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await update.OnPostAsync(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res.body.IsSuccess).toBe(false);
    });

    it("updates quantities and recalculates status", async () => {
        const update = new UpdateQuantity();
        const item = new Item("Widget", 5);

        jest.spyOn(Item, "FetchOneById").mockResolvedValue(item);
        jest.spyOn(item, "Save").mockResolvedValue(undefined);

        const req = {
            params: { itemId: item.Id },
            body: { unlisted: 0, listed: 4, sold: 1, rejected: 0 }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await update.OnPostAsync(req, res, next);

        expect(item.ListedQuantity).toBe(4);
        expect(item.SoldQuantity).toBe(1);
        expect(item.Status).toBe(ItemStatus.Listed);
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Quantities updated");
        expect(res.body.Data.Status).toBe(ItemStatus.Listed);
    });
});
