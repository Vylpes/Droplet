import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:itemId/update', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (!itemId) {
                next(createHttpError(404));
            }

            const name = req.body.name;
            const sku = req.body.sku;

            const item = await Item.FetchOneById<Item>(Item, itemId);
            
            item.EditBasicDetails(name, sku);

            await item.Save(Item, item);

            res.redirect(`/items/${itemId}`);
        });
    }
}