import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/ItemPurchaseStatus";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
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