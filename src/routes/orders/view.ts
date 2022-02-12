import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/ItemStatus";
import { ListingStatus } from "../../constants/ListingStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";
import List from "../itemPurchases/list";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/view/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const order = await Order.FetchOneById(Order, Id, [
                "Listings"
            ]);

            const listings = await Listing.FetchAll(Listing);

            if (!order) {
                next(createHttpError(404));
            }

            res.locals.order = order;
            res.locals.listings = listings.filter(x => x.Status == ListingStatus.Active);

            res.render('orders/view', res.locals.viewData);
        });
    }
}