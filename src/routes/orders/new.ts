import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import PostagePolicy from "../../entity/PostagePolicy";
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
            const postagePolicyId = req.body.postagePolicyId;

            const listing = await Listing.FetchOneById(Listing, listingId, [
                "Items",
                "PostagePolicy"
            ]);

            let postagePolicy: PostagePolicy;

            if (postagePolicyId == "INHERIT") {
                postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, listing.PostagePolicy.Id);
            } else {
                postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, postagePolicyId);                
            }
            
            let order = new Order(orderNumber, offerAccepted, buyer);

            await order.Save(Order, order);

            order = await Order.FetchOneById(Order, order.Id, [
                "Listings",
                "PostagePolicy"
            ]);

            order.AddListingToOrder(listing);
            order.AddPostagePolicyToOrder(postagePolicy);

            await order.Save(Order, order);

            listing.MarkAsSold(amount);

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.MarkAsSold(amount, ItemStatus.Listed);

                item.Save(Item, item);
            }

            res.redirect('/orders/awaiting-payment');
        });
    }
}