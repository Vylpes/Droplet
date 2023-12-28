import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { OrderStatus, OrderStatusTypes } from "../../constants/Status/OrderStatus";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import GetAllOrdersByStatus from "../../domain/queries/Order/GetAllOrdersByStatus";
import GetAllListingsByStatus from "../../domain/queries/Listing/GetAllListingsByStatus";
import GetAllPostagePoliciesNotArchived from "../../domain/queries/PostagePolicy/GetAllPostagePoliciesNotArchived";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let status = OrderStatusTypes.get(req.params.status);

            const orders = await GetAllOrdersByStatus(status);
            const listings = await GetAllListingsByStatus(ListingStatus.Active);
            const postagePolicies = await GetAllPostagePoliciesNotArchived();

            res.locals.orders = orders;
            res.locals.listings = listings;
            res.locals.postagePolicies = postagePolicies;

            res.render(`orders/list/${status}`, res.locals.viewData);
        });
    }
}