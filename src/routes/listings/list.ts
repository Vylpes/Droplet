import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { ListingStatus, ListingStatusNames } from "../../constants/Status/ListingStatus";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import GetAllListingsByStatus from "../../domain/queries/Listing/GetAllListingsByStatus";
import GetAllItemsWithUnlistedQuantity from "../../domain/queries/Item/GetAllItemsWithUnlistedQuantity";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const status: ListingStatus = Number(req.params.status);

            const listings = await GetAllListingsByStatus(status);
            const items = await GetAllItemsWithUnlistedQuantity();

            res.locals.listings = listings;
            res.locals.items = items;

            res.render(`listings/list/${req.params.status}`, res.locals.viewData);
        });
    }
}