import { Request } from "express";
import { OrderStatus } from "../../../src/constants/Status/OrderStatus";
import { ReturnStatus } from "../../../src/constants/Status/ReturnStatus";
import { Order } from "../../../src/database/entities/Order";
import { Return } from "../../../src/database/entities/Return";
import Refund from "../../../src/routes/api/returns/refund";
import { createMockRes } from "../../helpers/createMockRes";

describe("API returns refund", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("returns 400 when refundAmount is missing", async () => {
        const refund = new Refund();
        const req = {
            params: { Id: "r1" },
            body: {}
        } as unknown as Request;
        const res = createMockRes();

        await refund.OnPostAsync(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.IsSuccess).toBe(false);
    });

    it("refunds the return and marks the linked order returned", async () => {
        const refund = new Refund();
        const order = new Order("ORD-1", true, "buyer");
        const ret = new Return("RET-1", "RMA-1");
        ret.Order = order;

        jest.spyOn(Return, "FetchOneById").mockResolvedValue(ret);
        jest.spyOn(Order, "FetchOneById").mockResolvedValue(order);
        jest.spyOn(ret, "Save").mockResolvedValue(undefined);
        jest.spyOn(order, "Save").mockResolvedValue(undefined);

        const req = {
            params: { Id: ret.Id },
            body: { refundAmount: 15.5 }
        } as unknown as Request;
        const res = createMockRes();

        await refund.OnPostAsync(req, res);

        expect(ret.Status).toBe(ReturnStatus.Refunded);
        expect(ret.RefundAmount).toBe(15.5);
        expect(order.Status).toBe(OrderStatus.Returned);
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Return refunded");
    });
});
