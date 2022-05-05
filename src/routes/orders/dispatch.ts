import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../entity/Order";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Dispatch extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/dispatch', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const order = await Order.FetchOneById(Order, Id, [
                "Listings"
            ]);
            
            order.MarkAsDispatched();

            await order.Save(Order, order);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}