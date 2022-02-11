import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page"
import { ItemPurchase } from "../../entity/ItemPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const purchases = await ItemPurchase.FetchAll(ItemPurchase, [
                "Items"
            ]);

            res.locals.purchases = purchases;

            res.render('purchases/list', res.locals.viewData);
        });
    }
}