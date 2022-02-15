import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
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

            const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id);

            purchase.UpdateStatus(status);

            await purchase.Save(ItemPurchase, purchase);

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}