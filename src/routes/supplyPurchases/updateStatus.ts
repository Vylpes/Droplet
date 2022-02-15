import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class UpdateStatus extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/update-status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const status = req.body.status;

            const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, Id);

            purchase.UpdateStatus(status);

            await purchase.Save(SupplyPurchase, purchase);

            res.redirect(`/supply-purchases/view/${Id}`);
        });
    }
}