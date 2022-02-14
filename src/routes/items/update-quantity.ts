import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class UpdateQuantity extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:itemId/update-quantity', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (!itemId) {
                next(createHttpError(404));
            }
            
            const unlisted = req.body.unlisted;
            const listed = req.body.listed;
            const sold = req.body.sold;
            const rejected = req.body.rejected;

            const item = await Item.FetchOneById<Item>(Item, itemId);
            
            item.EditQuantities(unlisted, listed, sold, rejected);

            await item.Save(Item, item);

            res.redirect(`/items/${itemId}`);
        });
    }
}