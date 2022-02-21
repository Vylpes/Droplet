import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { SupplyStatus } from "../../constants/Status/SupplyStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import PostagePolicy from "../../entity/PostagePolicy";
import { Supply } from "../../entity/Supply";
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
                "Listings",
                "Supplies",
                "TrackingNumbers",
                "PostagePolicy"
            ]);

            const listings = await Listing.FetchAll(Listing);
            const supplies = await Supply.FetchAll(Supply);
            const postagePolicies = await PostagePolicy.FetchAll(PostagePolicy);

            if (!order) {
                next(createHttpError(404));
            }

            res.locals.order = order;
            res.locals.listings = listings.filter(x => x.Status == ListingStatus.Active);
            res.locals.supplies = supplies.filter(x => x.Status == SupplyStatus.Unused);
            res.locals.postagePolicies = postagePolicies.filter(x => !x.Archived);

            res.render('orders/view', res.locals.viewData);
        });
    }
}