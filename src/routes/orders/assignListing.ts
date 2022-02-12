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

export default class AssignListing extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/assign-listing', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const listingId = req.body.listingId;

            const listing = await Listing.FetchOneById(Listing, listingId, [
                "Items"
            ]);

            const order = await Order.FetchOneById(Order, Id, [
                "Listings"
            ]);

            order.AddListingToOrder(listing);

            await order.Save(Order, order);

            listing.MarkAsSold();

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.UpdateStatus(ItemStatus.Sold);

                await item.Save(Item, item);
            }

            res.redirect(`/orders/view/${Id}`);
        });
    }
}