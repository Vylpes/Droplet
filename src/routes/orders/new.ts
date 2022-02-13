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
import List from "../itemPurchases/list";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/new', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const orderNumber = req.body.orderNumber;
            const offerAccepted = req.body.offerAccepted;
            const buyer = req.body.buyer;
            const amount = req.body.amount;
            const listingId = req.body.listingId;

            const listing = await Listing.FetchOneById(Listing, listingId);
            
            let order = new Order(orderNumber, offerAccepted, buyer);

            await order.Save(Order, order);

            order = await Order.FetchOneById(Order, order.Id, [
                "Listings"
            ]);;

            order.AddListingToOrder(listing);

            await order.Save(Order, order);

            listing.MarkAsSold(amount);

            await listing.Save(Listing, listing);

            res.redirect('/orders/awaiting-payment');
        });
    }
}