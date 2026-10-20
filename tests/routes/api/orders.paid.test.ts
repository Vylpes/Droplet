import { Request } from "express";
import { OrderStatus } from "../../../src/constants/Status/OrderStatus";
import { Order } from "../../../src/database/entities/Order";
import Paid from "../../../src/routes/api/orders/paid";
import { createMockRes } from "../../helpers/createMockRes";

describe("API orders paid", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("marks the order as paid and returns the mapped DTO", async () => {
        const paid = new Paid();
        const order = new Order("ORD-9", false, "buyer");
        order.Listings = [];

        jest.spyOn(Order, "FetchOneById").mockResolvedValue(order);
        jest.spyOn(order, "Save").mockResolvedValue(undefined);

        const req = { params: { Id: order.Id } } as unknown as Request;
        const res = createMockRes();

        await paid.OnPostAsync(req, res);

        expect(order.Status).toBe(OrderStatus.AwaitingDispatch);
        expect(order.Save).toHaveBeenCalled();
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Order marked as paid");
        expect(res.body.Data.OrderNumber).toBe("ORD-9");
        expect(res.body.Data.Status).toBe(OrderStatus.AwaitingDispatch);
    });
});
