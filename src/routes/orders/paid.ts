import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Paid extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/paid', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const order = await Order.FetchOneById(Order, Id, [
                "Listings"
            ]);

            order.MarkAsPaid();

            await order.Save(Order, order);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}