import { Request, NextFunction } from "express";
import { OrderStatus } from "../../../src/constants/Status/OrderStatus";
import { ReturnStatus } from "../../../src/constants/Status/ReturnStatus";
import { Order } from "../../../src/database/entities/Order";
import { Return } from "../../../src/database/entities/Return";
import List from "../../../src/routes/api/returns/list";
import { createMockRes } from "../../helpers/createMockRes";

describe("API returns list", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("filters opened returns and includes recently dispatched orders", async () => {
        const list = new List();
        const opened = new Return("RET-1", "RMA-1");
        const started = new Return("RET-2", "RMA-2");
        started.Status = ReturnStatus.Started;

        const recentOrder = new Order("ORD-r", true, "buyer");
        recentOrder.Status = OrderStatus.Dispatched;
        recentOrder.DispatchBy = new Date();

        jest.spyOn(Return, "FetchAll").mockResolvedValue([opened, started]);
        jest.spyOn(Order, "FetchAll").mockResolvedValue([recentOrder]);

        const req = { params: { status: "opened" } } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await list.OnGetAsync(req, res, next);

        expect(res.body.Data.Returns).toHaveLength(1);
        expect(res.body.Data.Returns[0].ReturnNumber).toBe("RET-1");
        expect(res.body.Data.Orders).toHaveLength(1);
        expect(res.body.Data.Orders[0].OrderNumber).toBe("ORD-r");
    });

    it("filters expired returns by ReturnBy and active statuses", async () => {
        const list = new List();
        const expiredStarted = new Return("RET-exp", "RMA-exp");
        expiredStarted.Status = ReturnStatus.Started;
        expiredStarted.ReturnBy = new Date("2020-01-01");

        const futureStarted = new Return("RET-ok", "RMA-ok");
        futureStarted.Status = ReturnStatus.Started;
        futureStarted.ReturnBy = new Date("2099-01-01");

        const closedPast = new Return("RET-closed", "RMA-c");
        closedPast.Status = ReturnStatus.Closed;
        closedPast.ReturnBy = new Date("2020-01-01");

        jest.spyOn(Return, "FetchAll").mockResolvedValue([
            expiredStarted,
            futureStarted,
            closedPast
        ]);
        jest.spyOn(Order, "FetchAll").mockResolvedValue([]);

        const req = { params: { status: "expired" } } as unknown as Request;
        const res = createMockRes();
        const next = jest.fn() as NextFunction;

        await list.OnGetAsync(req, res, next);

        expect(res.body.Data.Returns).toHaveLength(1);
        expect(res.body.Data.Returns[0].ReturnNumber).toBe("RET-exp");
    });
});
