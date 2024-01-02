import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { SupplyPurchaseStatus, SupplyPurchaseStatusParse } from "../../constants/Status/SupplyPurchaseStatus";
import { Page } from "../../contracts/Page"
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";
import GetAllSupplyPurchasesByStatus from "../../domain/queries/SupplyPurchase/GetAllSupplyPurchasesByStatus";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const statusString = req.params.status;

            const status = SupplyPurchaseStatusParse.get(statusString);

            const purchases = await GetAllSupplyPurchasesByStatus(status);

            res.locals.purchases = purchases;

            res.render(`supply-purchases/list/${status}`, res.locals.viewData);
        });
    }
}