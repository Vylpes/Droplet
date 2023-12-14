import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { OrderStatus, OrderStatusTypes } from "../../constants/Status/OrderStatus";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Order from "../../contracts/entities/Order/Order";
import Listing from "../../contracts/entities/Listing/Listing";
import PostagePolicy from "../../contracts/entities/PostagePolicy/PostagePolicy";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let status = OrderStatusTypes.get(req.params.status);

            const ordersMaybe = await ConnectionHelper.FindMultiple<Order>("order", { status });
            const orders = ordersMaybe.Value!;

            const listingsMaybe = await ConnectionHelper.FindMultiple<Listing>("listing", { status: ListingStatus.Active });
            const listings = listingsMaybe.Value!;

            const postagePoliciesMaybe = await ConnectionHelper.FindMultiple<PostagePolicy>("postage-policy", { archived: false });
            const postagePolicies = postagePoliciesMaybe.Value!;

            res.locals.orders = orders;
            res.locals.listings = listings;
            res.locals.postagePolicies = postagePolicies;

            res.render(`orders/list/${status}`, res.locals.viewData);
        });
    }
}