import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/ItemStatus";
import { ListingStatus } from "../../constants/ListingStatus";
import { Page } from "../../contracts/Page"
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const listings = await Listing.FetchAll(Listing, [
                "Items"
            ]);

            const items = await Item.FetchAll(Item);

            res.locals.listings = listings;
            res.locals.items = items.filter(x => x.Status == ItemStatus.Unlisted);

            res.render('listings/list', res.locals.viewData);
        });
    }
}