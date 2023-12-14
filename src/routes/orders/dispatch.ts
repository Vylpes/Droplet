import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Order from "../../contracts/entities/Order/Order";
import { OrderStatus } from "../../constants/Status/OrderStatus";

export default class Dispatch extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/dispatch', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            await ConnectionHelper.UpdateOne<Order>("order", { uuid: Id }, { $set: { status: OrderStatus.Dispatched } });

            res.redirect(`/orders/view/${Id}`);
        });
    }
}