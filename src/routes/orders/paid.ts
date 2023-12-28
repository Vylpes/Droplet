import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { UserMiddleware } from "../../middleware/userMiddleware";
import UpdateOrderStatusCommand from "../../domain/commands/Order/UpdateOrderStatusCommand";
import { OrderStatus } from "../../constants/Status/OrderStatus";

export default class Paid extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/paid', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            await UpdateOrderStatusCommand(Id, OrderStatus.AwaitingDispatch);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}