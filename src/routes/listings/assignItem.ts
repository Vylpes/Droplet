import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/assign-item', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const itemId = req.body.itemId;

            const item = await Item.FetchOneById(Item, itemId);

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items"
            ]);

            listing.AddItemToListing(item);

            await listing.Save(Listing, listing);

            item.MarkAsListed(listing.Quantity, ItemStatus.Unlisted);

            await item.Save(Item, item);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}