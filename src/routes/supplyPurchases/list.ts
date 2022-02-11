import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page"
import { ItemPurchase } from "../../entity/ItemPurchase";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const purchases = await SupplyPurchase.FetchAll(SupplyPurchase, [
                "Supplies"
            ]);

            res.locals.purchases = purchases;

            res.render('supply-purchases/list', res.locals.viewData);
        });
    }
}