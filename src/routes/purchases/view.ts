import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Purchase } from "../../entity/Purchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

            const purchase = await Purchase.FetchOneById(Purchase, Id, [
                "Items"
            ]);

            if (!purchase) {
                next(createHttpError(404));
            }

            res.locals.purchase = purchase;

            res.render('purchases/view', res.locals.viewData);
        });
    }
}