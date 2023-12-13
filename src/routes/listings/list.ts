import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { ListingStatus, ListingStatusNames, ListingStatusTypes } from "../../constants/Status/ListingStatus";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Listing from "../../contracts/entities/Listing/Listing";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const status = ListingStatusTypes.get(req.params.status);

            const listings = await ConnectionHelper.FindMultiple<Listing>("listing", { status: status });

            const itemPurchases = await ConnectionHelper.FindMultiple<ItemPurchase>("item-purchase", { items: { status: ItemStatus.Unlisted } });
            const items = itemPurchases.Value!
                .flatMap(x => x.items);

            res.locals.listings = listings;
            res.locals.items = items;

            res.render(`listings/list/${req.params.status}`, res.locals.viewData);
        });
    }
}