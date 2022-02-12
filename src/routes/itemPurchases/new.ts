import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/ItemPurchaseStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/new', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const description = req.body.description;
            const price = req.body.price;
            
            const purchase = new ItemPurchase(description, price);

            await purchase.Save(ItemPurchase, purchase);

            res.redirect('/item-purchases/ordered');
        });
    }
}