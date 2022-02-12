import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Supply } from "../../entity/Supply";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignSupply extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/assign-supply', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const supplyId = req.body.supplyId;
            const amount = req.body.amount;

            const supply = await Supply.FetchOneById(Supply, supplyId);

            const order = await Order.FetchOneById(Order, Id, [
                "Supplies"
            ]);

            order.AddSupplyToOrder(supply);

            await order.Save(Order, order);

            supply.RemoveStock(amount);

            await supply.Save(Supply, supply);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}