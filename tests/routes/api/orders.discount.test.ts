import { Request, NextFunction } from "express";
import { Order } from "../../../src/database/entities/Order";
import Discount from "../../../src/routes/api/orders/discount";
import { createMockRes } from "../../helpers/createMockRes";

describe("API orders discount", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns 400 when amount is missing", async () => {
        const discount = new Discount();
        const req = {
            params: { Id: "o1" },
            body: {}
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await discount.OnPostAsync(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res.body.IsSuccess).toBe(false);
    });

    it("applies a valid discount to the order price", async () => {
        const discount = new Discount();
        const order = new Order("ORD-3", true, "buyer");
        order.Price = 40;

        jest.spyOn(Order, "FetchOneById").mockResolvedValue(order);
        jest.spyOn(order, "Save").mockResolvedValue(undefined);

        const req = {
            params: { Id: order.Id },
            body: { amount: 10 }
        } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await discount.OnPostAsync(req, res, next);

        expect(order.Price).toBe(30);
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Discount applied");
        expect(res.body.Data.Price).toBe(30);
    });
});
