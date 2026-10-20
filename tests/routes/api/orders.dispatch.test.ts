import { Request } from "express";
import { OrderStatus } from "../../../src/constants/Status/OrderStatus";
import { Order } from "../../../src/database/entities/Order";
import Dispatch from "../../../src/routes/api/orders/dispatch";
import { createMockRes } from "../../helpers/createMockRes";

describe("API orders dispatch", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("marks the order as dispatched", async () => {
        const dispatch = new Dispatch();
        const order = new Order("ORD-2", true, "buyer");
        order.Status = OrderStatus.AwaitingDispatch;
        order.Listings = [];

        jest.spyOn(Order, "FetchOneById").mockResolvedValue(order);
        jest.spyOn(order, "Save").mockResolvedValue(undefined);

        const req = { params: { Id: order.Id } } as unknown as Request;
        const res = createMockRes();

        await dispatch.OnPostAsync(req, res);

        expect(order.Status).toBe(OrderStatus.Dispatched);
        expect(order.Save).toHaveBeenCalled();
        expect(res.body.IsSuccess).toBe(true);
        expect(res.body.Message).toBe("Order dispatched");
        expect(res.body.Data.Status).toBe(OrderStatus.Dispatched);
    });
});
