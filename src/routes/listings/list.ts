import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { ListingStatus } from "../../constants/Status/ListingStatus";
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
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const status = req.params.status;

            const listings = await Listing.FetchAll(Listing, [
                "Items"
            ]);

            const items = await Item.FetchAll(Item);

            let listingsVisible: Listing[];

            switch(status) {
                case 'active':
                    listingsVisible = listings.filter(x => x.Status == ListingStatus.Active);
                    break;
                case 'sold':
                    listingsVisible = listings.filter(x => x.Status == ListingStatus.Sold);
                    break;
                case 'unsold':
                    listingsVisible = listings.filter(x => x.Status == ListingStatus.Unsold);
                    break;
                case 'expired':
                    listingsVisible = listings.filter(x => x.Status == ListingStatus.Active && x.EndDate < new Date());
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            res.locals.listings = listingsVisible;
            res.locals.items = items.filter(x => x.Status == ItemStatus.Unlisted);

            res.render(`listings/list/${status}`, res.locals.viewData);
        });
    }
}