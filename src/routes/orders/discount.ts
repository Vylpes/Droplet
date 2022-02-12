import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Discount extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/discount', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const amount = req.body.amount;

            const order = await Order.FetchOneById(Order, Id);

            order.ApplyDiscount(amount);

            await order.Save(Order, order);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}