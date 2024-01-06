import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemPurchaseStatus, ItemPurchaseStatusParse } from "../../constants/Status/ItemPurchaseStatus";
import { Page } from "../../contracts/Page"
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import GetAllItemPurchasesByStatus from "../../domain/queries/ItemPurchase/GetAllItemPurchasesByStatus";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const statusString = req.params.status;
            const status = ItemPurchaseStatusParse.get(statusString);

            const purchases = await GetAllItemPurchasesByStatus(status);

            res.locals.purchases = purchases;

            res.render(`item-purchases/list/${statusString}`, res.locals.viewData);
        });
    }
}