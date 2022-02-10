import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:itemId', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (!itemId) {
                next(createHttpError(404));
            }

            const item = await Item.GetItem(itemId);

            if (!item) {
                next(createHttpError(404));
            }

            res.locals.item = item;

            res.render('items/view');
        });
    }
}