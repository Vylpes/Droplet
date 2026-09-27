import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Order } from "../../../database/entities/Order";
import { mapOrder } from "../../../dto";

export default class Paid implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const Id = (req.params.Id as string);

        const order = await Order.FetchOneById(Order, Id, {
            Listings: true
        });

        order.MarkAsPaid();

        await order.Save(Order, order);

        res.json(GenerateResponse(true, "Order marked as paid", mapOrder(order, true)));
    }
}
