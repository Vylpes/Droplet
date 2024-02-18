import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { Order } from "../../database/entities/Order";

export default class Paid implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const Id = req.params.Id;

        const order = await Order.FetchOneById(Order, Id, [
            "Listings"
        ]);

        order.MarkAsPaid();

        await order.Save(Order, order);

        res.redirect(`/orders/view/${Id}`);
    }
}