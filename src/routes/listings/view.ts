import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";
import List from "../itemPurchases/list";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items"
            ]);

            const items = await Item.FetchAll(Item);

            if (!listing) {
                next(createHttpError(404));
            }

            res.locals.listing = listing;
            res.locals.items = items.filter(x => x.Status == ItemStatus.Unlisted);

            res.render('listings/view', res.locals.viewData);
        });
    }
}